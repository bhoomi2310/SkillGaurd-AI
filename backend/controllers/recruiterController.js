import User from '../models/User.js';
import SkillVerification from '../models/SkillVerification.js';
import Submission from '../models/Submission.js';

// @desc    Search students by verified skills
// @route   GET /api/recruiter/search
// @access  Private (Recruiter only)
export const searchStudents = async (req, res) => {
  try {
    const { skills, minScore, institution, year } = req.query;

    // Build query for users with verified skills
    const query = { role: 'student' };

    if (institution) {
      query['profile.institution'] = { $regex: institution, $options: 'i' };
    }

    if (year) {
      query['profile.year'] = year;
    }

    let users = await User.find(query);

    // Filter by skills and scores
    if (skills || minScore) {
      const skillArray = skills ? skills.split(',') : [];
      const minScoreNum = minScore ? parseInt(minScore) : 0;

      users = users.filter((user) => {
        if (!user.verifiedSkills || user.verifiedSkills.length === 0) {
          return false;
        }

        // If specific skills requested, check if user has them
        if (skillArray.length > 0) {
          const userSkills = user.verifiedSkills.map((vs) => vs.skill.toLowerCase());
          const hasRequiredSkills = skillArray.some((skill) =>
            userSkills.includes(skill.toLowerCase())
          );
          if (!hasRequiredSkills) return false;
        }

        // Check minimum score
        if (minScoreNum > 0) {
          const maxScore = Math.max(
            ...user.verifiedSkills.map((vs) => vs.score),
            0
          );
          if (maxScore < minScoreNum) return false;
        }

        return true;
      });
    }

    // Populate with verification details
    const studentsWithDetails = await Promise.all(
      users.map(async (user) => {
        const verifications = await SkillVerification.find({
          studentId: user._id,
        })
          .populate('taskId', 'title description')
          .sort({ verifiedAt: -1 })
          .limit(10);

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          verifiedSkills: user.verifiedSkills,
          recentVerifications: verifications,
        };
      })
    );

    res.json(studentsWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's complete skill profile
// @route   GET /api/recruiter/student/:studentId
// @access  Private (Recruiter only)
export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const verifications = await SkillVerification.find({
      studentId: student._id,
    })
      .populate('taskId', 'title description requiredSkills difficulty')
      .populate('submissionId', 'submissionType githubRepo fileUpload')
      .sort({ verifiedAt: -1 });

    const submissions = await Submission.find({ studentId: student._id })
      .populate('taskId', 'title description')
      .populate('evaluationResult')
      .sort({ submittedAt: -1 });

    // Calculate skill statistics
    const skillStats = {};
    student.verifiedSkills.forEach((vs) => {
      if (!skillStats[vs.skill]) {
        skillStats[vs.skill] = {
          skill: vs.skill,
          scores: [],
          averageScore: 0,
          verificationCount: 0,
        };
      }
      skillStats[vs.skill].scores.push(vs.score);
      skillStats[vs.skill].verificationCount++;
    });

    Object.keys(skillStats).forEach((skill) => {
      const stats = skillStats[skill];
      stats.averageScore =
        stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
    });

    res.json({
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        profile: student.profile,
      },
      skillStatistics: Object.values(skillStats),
      verifications,
      submissions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI skill report for a verification
// @route   GET /api/recruiter/verification/:verificationId
// @access  Private (Recruiter only)
export const getVerificationReport = async (req, res) => {
  try {
    const verification = await SkillVerification.findById(req.params.verificationId)
      .populate('taskId', 'title description requiredSkills evaluationCriteria')
      .populate('studentId', 'name email profile')
      .populate('submissionId', 'submissionType githubRepo fileUpload submittedAt');

    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    res.json(verification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download student summary (JSON format)
// @route   GET /api/recruiter/student/:studentId/summary
// @access  Private (Recruiter only)
export const getStudentSummary = async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const verifications = await SkillVerification.find({
      studentId: student._id,
    })
      .populate('taskId', 'title description')
      .sort({ verifiedAt: -1 });

    // Calculate aggregated skill scores
    const skillAggregation = {};
    student.verifiedSkills.forEach((vs) => {
      if (!skillAggregation[vs.skill]) {
        skillAggregation[vs.skill] = {
          scores: [],
          highestScore: 0,
          latestVerification: null,
        };
      }
      skillAggregation[vs.skill].scores.push(vs.score);
      if (vs.score > skillAggregation[vs.skill].highestScore) {
        skillAggregation[vs.skill].highestScore = vs.score;
      }
    });

    const skillSummary = Object.entries(skillAggregation).map(([skill, data]) => ({
      skill,
      highestScore: data.highestScore,
      averageScore:
        data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
      verificationCount: data.scores.length,
    }));

    const summary = {
      student: {
        name: student.name,
        email: student.email,
        profile: student.profile,
      },
      skills: skillSummary,
      totalVerifications: verifications.length,
      resumeBullets: verifications.map((v) => v.resumeBullet),
      verifications: verifications.map((v) => ({
        task: v.taskId.title,
        overallScore: v.overallScore,
        skillBreakdown: Object.fromEntries(v.skillBreakdown),
        strengths: v.strengths,
        weaknesses: v.weaknesses,
        verifiedAt: v.verifiedAt,
      })),
      generatedAt: new Date().toISOString(),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="student-${student._id}-summary.json"`
    );
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

