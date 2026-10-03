const Case = require('../models/Case');
const Entity = require('../models/Entity');
const Evidence = require('../models/Evidence');
const Relationship = require('../models/Relationship');
const Investigation = require('../models/Investigation');
const Activity = require('../models/Activity');
const Alert = require('../models/Alert');

exports.getAnalytics = async (req, res) => {
  try {
    const [cases, entities, evidence, relationships, investigations, activities, unreadAlertsCount] = await Promise.all([
      Case.find(),
      Entity.find(),
      Evidence.find(),
      Relationship.find(),
      Investigation.find(),
      Activity.find().sort({ timestamp: -1 }).limit(10),
      Alert.countDocuments({ isRead: false }),
    ]);

    const totalCases = cases.length;
    const activeCases = cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
    const criticalCases = cases.filter(c => c.priority === 'Critical').length;
    const highCases = cases.filter(c => c.priority === 'High').length;
    const resolvedCases = cases.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

    // Priority counts
    const priorityCounts = {
      Critical: criticalCases,
      High: highCases,
      Medium: cases.filter(c => c.priority === 'Medium').length,
      Low: cases.filter(c => c.priority === 'Low').length,
    };

    // Status counts
    const statusCounts = {
      New: cases.filter(c => c.status === 'New').length,
      'Under Investigation': cases.filter(c => c.status === 'Under Investigation').length,
      'On Hold': cases.filter(c => c.status === 'On Hold').length,
      Resolved: cases.filter(c => c.status === 'Resolved').length,
      Closed: cases.filter(c => c.status === 'Closed').length,
    };

    // Category counts
    const categoryCounts = {};
    for (const c of cases) {
      const cat = c.category || 'Investigation';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }

    // Entity types
    const entityTypeCounts = {};
    for (const e of entities) {
      entityTypeCounts[e.type] = (entityTypeCounts[e.type] || 0) + 1;
    }

    // Evidence types
    const evidenceTypeCounts = {};
    for (const ev of evidence) {
      evidenceTypeCounts[ev.type] = (evidenceTypeCounts[ev.type] || 0) + 1;
    }

    // Suspect frequency
    const suspectFrequency = {};
    for (const c of cases) {
      if (c.suspectName && c.suspectName !== 'Unknown') {
        suspectFrequency[c.suspectName] = (suspectFrequency[c.suspectName] || 0) + 1;
      }
    }

    const topSuspects = Object.entries(suspectFrequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Insights
    const insights = [];
    if (topSuspects.length > 0 && topSuspects[0].count > 1) {
      insights.push(`Cross-Case Pattern: "${topSuspects[0].name}" is linked across ${topSuspects[0].count} separate cases.`);
    }
    if (criticalCases > 0) {
      insights.push(`Urgent: ${criticalCases} Critical priority investigation${criticalCases > 1 ? 's' : ''} require executive review.`);
    }
    if (activeCases > resolvedCases && totalCases > 2) {
      insights.push(`Caseload Velocity: ${activeCases} active cases versus ${resolvedCases} resolved.`);
    }
    if (relationships.length > 10) {
      insights.push(`Relationship Intelligence: ${relationships.length} active intelligence vectors mapped across ${entities.length} entities.`);
    }

    res.json({
      success: true,
      kpis: {
        totalCases,
        activeCases,
        criticalCases,
        resolvedCases,
        activeInvestigations: investigations.filter(i => i.status === 'Active').length,
        evidenceItems: evidence.length,
        totalEntities: entities.length,
        totalRelationships: relationships.length,
        unreadAlerts: unreadAlertsCount,
        solvedRate: totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0,
      },
      charts: {
        priorityCounts,
        statusCounts,
        categoryCounts,
        entityTypeCounts,
        evidenceTypeCounts,
        topSuspects,
      },
      insights,
      recentActivities: activities,
    });
  } catch (err) {
    console.error('getAnalytics error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving analytics' });
  }
};
