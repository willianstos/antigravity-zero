import { execSync } from 'child_process';

const args = process.argv.slice(2);
const command = args[0];
const phaseId = args[1];
const extra = args.slice(2).join(' ');

function run(cmd) {
  try {
    return execSync(cmd, { stdio: 'unique' }).toString().trim();
  } catch (e) {
    if (cmd.includes('rev-parse')) return 'false';
    console.error('CMD Error:', cmd, e.message);
    process.exit(1);
  }
}

if (command === 'start') {
  console.log('INIT START');
  try { run('git rev-parse --is-inside-work-tree'); } catch { run('git init'); }
  run('git checkout -b feature/' + phaseId + ' 2>/dev/null || git checkout feature/' + phaseId);
  run('git add .');
  run('git commit -m "chore(' + phaseId + '): Start" --allow-empty');
  console.log('INIT DONE');
} else if (command === 'commit') {
  console.log('COMMIT START');
  run('git add .');
  run('git commit -m "feat(' + phaseId + '): ' + extra + '" --allow-empty');
  console.log('COMMIT DONE');
}
