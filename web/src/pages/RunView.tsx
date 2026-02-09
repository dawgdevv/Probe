import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTestRun, getTestResults, type TestResult } from '../api/client';

export default function RunView() {
  const { runId } = useParams<{ runId: string }>();
  const id = Number(runId);

  const { data: run } = useQuery({
    queryKey: ['run', id],
    queryFn: () => getTestRun(id),
  });

  const { data: results } = useQuery({
    queryKey: ['runResults', id],
    queryFn: () => getTestResults(id),
  });

  const passRate = run ? (run.total_tests > 0 ? Math.round((run.passed_tests / run.total_tests) * 100) : 0) : 0;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-6 font-['JetBrains_Mono'] uppercase tracking-wider">
        <Link to="/" className="hover:text-[var(--text-primary)] no-underline text-[var(--text-tertiary)] transition-colors">
          Projects
        </Link>
        <span>/</span>
        {run && (
          <>
            <Link
              to={`/suites/${run.suite_id}`}
              className="hover:text-[var(--text-primary)] no-underline text-[var(--text-tertiary)] transition-colors"
            >
              Suite
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--text-secondary)]">Run #{runId}</span>
      </div>

      {run && (
        <>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Run #{run.id}</h2>
            <span
              className={`text-[10px] font-bold px-3 py-1.5 rounded font-['JetBrains_Mono'] uppercase tracking-wider ${
                run.status === 'passed'
                  ? 'bg-[var(--success-muted)] text-[var(--success)]'
                  : run.status === 'failed'
                  ? 'bg-[var(--danger-muted)] text-[var(--danger)]'
                  : 'bg-[var(--warning-muted)] text-[var(--warning)]'
              }`}
            >
              {run.status}
            </span>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <InfoCard label="Total" value={run.total_tests} />
            <InfoCard label="Passed" value={run.passed_tests} color="var(--success)" />
            <InfoCard label="Failed" value={run.failed_tests} color="var(--danger)" />
            <InfoCard label="Pass Rate" value={`${passRate}%`} color={passRate === 100 ? 'var(--success)' : passRate > 50 ? 'var(--text-primary)' : 'var(--danger)'} />
            <InfoCard
              label="Started"
              value={new Date(run.started_at).toLocaleTimeString()}
              small
            />
          </div>
        </>
      )}

      {/* Results table */}
      <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-[var(--text-secondary)]">Test Results</h3>
      {!results || results.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[var(--border)] rounded">
          <p className="text-[var(--text-tertiary)] text-xs">No results available</p>
        </div>
      ) : (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-[10px] text-[var(--text-tertiary)] font-semibold uppercase tracking-widest w-12">
                  
                </th>
                <th className="text-left px-4 py-3 text-[10px] text-[var(--text-tertiary)] font-semibold uppercase tracking-widest">
                  Test
                </th>
                <th className="text-left px-4 py-3 text-[10px] text-[var(--text-tertiary)] font-semibold uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-[10px] text-[var(--text-tertiary)] font-semibold uppercase tracking-widest">
                  Duration
                </th>
                <th className="text-left px-4 py-3 text-[10px] text-[var(--text-tertiary)] font-semibold uppercase tracking-widest">
                  Error
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result: TestResult) => (
                <tr
                  key={result.id}
                  className="border-b border-[var(--border)] last:border-none hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${result.passed ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`} />
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{result.test_name}</td>
                  <td className="px-4 py-3">
                    {result.status_code > 0 && (
                      <span className="bg-[var(--bg-tertiary)] px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] text-[var(--text-secondary)]">
                        {result.status_code}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-tertiary)] font-['JetBrains_Mono']">
                    {result.duration_ms}ms
                  </td>
                  <td className="px-4 py-3 text-[var(--danger)] text-[10px] max-w-[300px] truncate font-['JetBrains_Mono']">
                    {result.error_message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  label,
  value,
  color,
  small,
}: {
  label: string;
  value: string | number;
  color?: string;
  small?: boolean;
}) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-center">
      <div
        className={`font-bold font-['JetBrains_Mono'] ${small ? 'text-xs' : 'text-xl'}`}
        style={{ color: color ?? 'var(--text-primary)' }}
      >
        {value}
      </div>
      <div className="text-[10px] text-[var(--text-tertiary)] mt-1 uppercase tracking-widest font-semibold">{label}</div>
    </div>
  );
}
