import process from 'process';

// Must be https!
export function testScoreUrl() {
  return process.env.TEST_SCORE_URL ||
    'https://live-test-scores.herokuapp.com/scores';
}
