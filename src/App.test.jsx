import React from 'react';
import { describe, it, expect } from 'vitest';
import { 
  calculateIoU, 
  calculateAvailabilityScore, 
  calculateExperienceScore, 
  matchCandidates 
} from './utils/matchingEngine.js';
import { mockProfiles } from './data/mockProfiles.js';

describe('ProjectMatch Application Readiness & Matching Engine Tests', () => {
  
  describe('IoU (Intersection-over-Union) Calculation', () => {
    it('calculates exact IoU when candidate skills overlap required skills', () => {
      const required = ['React', 'TypeScript', 'Tailwind CSS'];
      const candidate = ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Redux'];
      const result = calculateIoU(required, candidate);

      // Intersection: 3 (React, TypeScript, Tailwind CSS), Union: 5
      expect(result.iou).toBeCloseTo(0.6, 2);
      expect(result.intersection).toEqual(expect.arrayContaining(['React', 'TypeScript', 'Tailwind CSS']));
    });

    it('handles empty skill lists gracefully without division by zero', () => {
      const resultEmptyReq = calculateIoU([], ['React']);
      expect(resultEmptyReq.iou).toBe(0);

      const resultBothEmpty = calculateIoU([], []);
      expect(resultBothEmpty.iou).toBe(0);
    });
  });

  describe('Availability & Experience Scoring Weights', () => {
    it('awards full score 1.0 for matching availability', () => {
      expect(calculateAvailabilityScore('Weekends', 'Weekends')).toBe(1.0);
    });

    it('awards high compatibility 0.85 for full-time candidates', () => {
      expect(calculateAvailabilityScore('Weekends', 'Full-time')).toBe(0.85);
    });

    it('returns 0 for non-overlapping schedules', () => {
      expect(calculateAvailabilityScore('Weekends', 'Evenings')).toBe(0);
    });

    it('scores experience tiers with appropriate hierarchical weighting', () => {
      expect(calculateExperienceScore('Intermediate', 'Intermediate')).toBe(1.0);
      expect(calculateExperienceScore('Advanced', 'Intermediate')).toBe(0.65);
      expect(calculateExperienceScore('Advanced', 'Beginner')).toBe(0.25);
    });
  });

  describe('Candidate Match Ranking & Score Constraints', () => {
    it('ensures all candidate match scores are strictly within [0, 100] percentage bounds', () => {
      const criteria = {
        requiredSkills: ['React', 'TypeScript'],
        targetAvailability: 'Weekends',
        experienceLevel: 'Intermediate',
        targetInterests: ['AI / ML']
      };

      const ranked = matchCandidates(criteria, mockProfiles);

      expect(ranked.length).toBeGreaterThan(0);
      ranked.forEach((candidate) => {
        expect(candidate.matchScore).toBeGreaterThanOrEqual(0);
        expect(candidate.matchScore).toBeLessThanOrEqual(100);
        expect(candidate.rawScore).toBeGreaterThanOrEqual(0);
        expect(candidate.rawScore).toBeLessThanOrEqual(1.0);
        
        // Validate breakdown subscores
        expect(candidate.breakdown.skillScore).toBeGreaterThanOrEqual(0);
        expect(candidate.breakdown.availabilityScore).toBeGreaterThanOrEqual(0);
        expect(candidate.breakdown.experienceScore).toBeGreaterThanOrEqual(0);
        expect(candidate.breakdown.interestScore).toBeGreaterThanOrEqual(0);
      });
    });

    it('orders candidates in descending match score order', () => {
      const criteria = {
        requiredSkills: ['Python', 'Machine Learning'],
        targetAvailability: 'Evenings',
        experienceLevel: 'Advanced'
      };

      const ranked = matchCandidates(criteria, mockProfiles);

      for (let i = 0; i < ranked.length - 1; i++) {
        expect(ranked[i].matchScore).toBeGreaterThanOrEqual(ranked[i + 1].matchScore);
      }
    });
  });
});
