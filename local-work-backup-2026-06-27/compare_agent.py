from pathlib import Path
from difflib import unified_diff
cur = Path('frontend/src/app/components/AgentDashboard.tsx').read_text(encoding='utf-8', errors='replace').splitlines()
bak = Path('agent_backup.tsx').read_text(encoding='utf-8', errors='replace').splitlines()
keys=['groupTravailleursByEmployeur','function AgentImmatriculation','function AgentCotisation','function AdminDashboard','export function AgentDashboard','getEmployeurs','validerEmployeur','clearAuth','getStatsAdmin','getActualites','getActivityLogs','validerDeclaration','relancerCotisation','getStoredUser']
print('LINE_COUNTS current', len(cur), 'backup', len(bak))
for k in keys:
    print(f'{k}: current={any(k in line for line in cur)}, backup={any(k in line for line in bak)}')
print('\n--- current last 20 lines ---')
for line in cur[-20:]:
    print(line)
print('\n--- backup last 20 lines ---')
for line in bak[-20:]:
    print(line)
print('\n--- Diff summary for key markers ---')
for k in keys:
    cur_lines=[i+1 for i,l in enumerate(cur) if k in l]
    bak_lines=[i+1 for i,l in enumerate(bak) if k in l]
    print(f'{k}: current={cur_lines} backup={bak_lines}')
