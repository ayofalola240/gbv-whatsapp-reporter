/**
 * @file Manages user conversation sessions using a persistent JSON file.
 */

import { promises as fs } from 'fs'; // Using fs.promises for async/await
import path from 'path'; // To create a reliable file path
import { Language } from '../config/translation';

// Define the structure of a user session.
export interface UserSession {
  currentStep: string;
  language?: Language;
  reportData: Partial<any>;
}

// Define the structure for the entire sessions object that will be stored.
type SessionStore = Record<string, UserSession>;

// Create a reliable path to our storage file.
// This will create 'sessions.json' in the same directory as this file.
const SESSIONS_FILE_PATH = path.join(__dirname, 'sessions.json');

/**
 * Reads all sessions from the JSON file.
 * Private helper function.
 * @returns A promise that resolves to the session store object.
 */
const readSessionsFromFile = async (): Promise<SessionStore> => {
  try {
    // Await the reading of the file
    const data = await fs.readFile(SESSIONS_FILE_PATH, 'utf-8');
    // Parse the JSON data into an object
    return JSON.parse(data) as SessionStore;
  } catch (error: any) {
    // If the file doesn't exist (ENOENT) or is empty, it's not an error.
    // We just start with an empty session object.
    if (error.code === 'ENOENT') {
      return {};
    }
    // For any other errors (like malformed JSON), log it and throw.
    console.error('Error reading sessions file:', error);
    throw error;
  }
};

/**
 * Writes the entire session store back to the JSON file.
 * Private helper function.
 * @param sessions The session store object to write.
 */
const writeSessionsToFile = async (sessions: SessionStore): Promise<void> => {
  try {
    // Convert the object to a formatted JSON string and write it to the file.
    // Using 'null, 2' for pretty-printing makes the file readable for debugging.
    await fs.writeFile(SESSIONS_FILE_PATH, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to sessions file:', error);
    throw error;
  }
};

// --- EXPORTED FUNCTIONS ---
// Note: All functions are now 'async' because file I/O is asynchronous.

export const getSession = async (userId: string): Promise<UserSession | undefined> => {
  const sessions = await readSessionsFromFile();
  return sessions[userId];
};

export const createSession = async (userId: string): Promise<UserSession> => {
  const sessions = await readSessionsFromFile();
  const newSession: UserSession = {
    currentStep: 'start',
    reportData: {}
  };
  sessions[userId] = newSession;
  await writeSessionsToFile(sessions);
  return newSession;
};

export const updateSession = async (userId: string, session: UserSession): Promise<void> => {
  const sessions = await readSessionsFromFile();
  sessions[userId] = session;
  await writeSessionsToFile(sessions);
};

export const deleteSession = async (userId: string): Promise<void> => {
  const sessions = await readSessionsFromFile();
  delete sessions[userId];
  await writeSessionsToFile(sessions);
};
