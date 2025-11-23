import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store validated student data in memory (load once on startup)
let validStudents = new Map();

/**
 * Load and parse student data from CSV file
 */
export const loadStudentData = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../student_data_rows.csv');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn('⚠️  Student data CSV file not found at:', filePath);
      resolve(validStudents);
      return;
    }

    validStudents.clear();

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // CSV columns: ht_no, student_name, year
        const studentId = row.ht_no?.trim().toUpperCase();
        if (studentId) {
          validStudents.set(studentId, {
            studentId,
            name: row.student_name?.trim() || 'Unknown',
            year: row.year?.trim() || 'Unknown',
          });
        }
      })
      .on('end', () => {
        console.log(`✅ Loaded ${validStudents.size} valid students from CSV`);
        resolve(validStudents);
      })
      .on('error', (err) => {
        console.error('❌ Error loading student data:', err.message);
        reject(err);
      });
  });
};

/**
 * Validate if a student ID exists in the database
 * @param {string} studentId - The student ID to validate
 * @returns {object|null} Student data if valid, null otherwise
 */
export const validateStudent = (studentId) => {
  if (!studentId) return null;
  
  const normalizedId = studentId.trim().toUpperCase();
  return validStudents.get(normalizedId) || null;
};

/**
 * Get all valid student IDs (for debugging/testing)
 * @returns {array} Array of valid student IDs
 */
export const getValidStudentIds = () => {
  return Array.from(validStudents.keys());
};

/**
 * Check if a student ID exists
 * @param {string} studentId - The student ID to check
 * @returns {boolean} True if student exists, false otherwise
 */
export const isValidStudent = (studentId) => {
  if (!studentId) return false;
  const normalizedId = studentId.trim().toUpperCase();
  return validStudents.has(normalizedId);
};

/**
 * Get student count
 * @returns {number} Number of valid students
 */
export const getStudentCount = () => {
  return validStudents.size;
};

