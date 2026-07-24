# Load Action

1. Check $ARGUMENTS (after "load"):
   - If it looks like a filename (single word, no spaces): Look for `context/hotfix/{name}.md`
   - If it's multiple words: Use as inline bug description, generate problem statement and goals
   - If empty: Error - "load" requires a spec filename or bug description

2. Update current-fix.md:
   - Update H1 heading to include fix name (e.g., `# Current Fix: Over-Segmentation`)
   - Write a clear problem description under ## Problem
   - Leave ## Root Cause blank (filled during investigate)
   - Write success criteria as bullet points under ## Goals
   - Write any additional notes/context under ## Notes
   - Set Status to "Not Started"

3. Confirm spec loaded and show the fix summary
4. Don't implement the fix without the user's ask
