import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getSuite, runSuite, listRuns, type TestRun, type RunResponse } from '../api/client';

export default function SuiteView() {
  const { suiteId } = useParams<{ suiteId: string }>();
  const id = Number(suiteId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [runResult, setRunResult] = useState<RunResponse | null>(null);

  const { data: suite } = useQuery({
    queryKey: ['suite', id],
    queryFn: () => getSuite(id),
  });

  const { data: runs } = useQuery({
    queryKey: ['runs', id],
    queryFn: () => listRuns(id),
  });

  const runMutation = useMutation({
    mutationFn: () => runSuite(id),
    onSuccess: (data) => {
      setRunResult(data);
      queryClient.invalidateQueries({ queryKey: ['runs', id] });
      toast.success(`${data.passed_tests}/${data.total_tests} passed`);
    },
    onError: () => toast.error('Failed to run tests'),
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-6 font-['JetBrains_Mono'] uppercase tracking-wider">
        <Link to="/" className="hover:text-[var(--text-primary)] no-underline text-[var(--text-tertiary)] transition-colors">
          Projects
        </Link>
        <span>/</span>
        {suite && (
          <>
            <Link
              to={`/projects/${suite.project_id}`}
              className="hover:text-[var(--text-primary)] no-underline text-[var(--text-tertiary)] transition-colors"
            >
              Project
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--text-secondary)]">{suite?.name ?? '...'}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">{suite?.name}</h2>
        <button
          onClick={() => runMutation.mutate()}
          disabled={runMutation.isPending}
          className="bg-white hover:bg-[var(--accent-hover)] text-black px-5 py-2.5 rounded text-xs font-semibold transition-all cursor-pointer border-none disabled:opacity-50 uppercase tracking-wider"
        >
          {runMutation.isPending ? 'Running...' : '▶ Run Tests'}
        </button>
      </div>

      {/* YAML Content */}
      {suite && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded mb-8 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[var(--border)] text-[10px] text-[var(--text-tertiary)] font-semibold font-['JetBrains_Mono'] uppercase tracking-widest">
            Test Definition — YAML
          </div>
          <pre className="p-4 m-0 text-xs font-['JetBrains_Mono'] text-[var(--text-secondary)] overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {suite.yaml_content}
          </pre>
        </div>
      )}

      {/* Live Run Results */}
      {runResult && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-[var(--text-secondary)]">Latest Run</h3>
          <div className="flex gap-3 mb-5">
            <StatusBadge
              label="Total"
              value={runResult.total_tests}
              color="var(--text-primary)"
            />
            <StatusBadge
              label="Passed"
              value={runResult.passed_tests}
              color="var(--success)"
            />
            <StatusBadge
              label="Failed"
              value={runResult.failed_tests}
              color="var(--danger)"
            />
          </div>
          <div className="space-y-1">
            {runResult.results.map((r, i) => (
              <div
                key={i}
                className={`flex items-center justify-between bg-[var(--bg-secondary)] border rounded px-4 py-3 ${
                  r.Passed ? 'border-[var(--border)]' : 'border-[var(--danger)]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${r.Passed ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`} />
                  <span className="text-xs font-medium">{r.Name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] font-['JetBrains_Mono']">
                  {r.StatusCode > 0 && (
                    <span className="bg-[var(--bg-tertiary)] px-2 py-0.5 rounded text-[10px]">
                      {r.StatusCode}
                    </span>
                  )}
                  <span>{(r.Duration / 1_000_000).toFixed(0)}ms</span>
                  {r.Error && (
                    <span className="text-[var(--danger)] text-[10px] max-w-[200px] truncate">
                      {r.Error}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Run History */}
      <div>
        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-[var(--text-secondary)]">Run History</h3>
        {!runs || runs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[var(--border)] rounded">
            <p className="text-[var(--text-tertiary)] text-xs">
              No runs yet — click "Run Tests" to execute this suite
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {runs.map((run: TestRun) => (
              <div
                key={run.id}
                onClick={() => navigate(`/runs/${run.id}`)}
                className="flex items-center justify-between bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 cursor-pointer transition-all hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)] group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded font-['JetBrains_Mono'] uppercase tracking-wider ${
                      run.status === 'passed'
                        ? 'bg-[var(--success-muted)] text-[var(--success)]'
                        : run.status === 'failed'
                        ? 'bg-[var(--danger-muted)] text-[var(--danger)]'
                        : 'bg-[var(--warning-muted)] text-[var(--warning)]'
                    }`}
                  >
                    {run.status}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {run.passed_tests}/{run.total_tests} passed
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[var(--text-tertiary)] font-['JetBrains_Mono']">
                    {new Date(run.started_at).toLocaleString()}
                  </span>
                  <span className="text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors text-xs">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-5 py-3 text-center min-w-[80px]">
      <div className="text-xl font-bold font-['JetBrains_Mono']" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] text-[var(--text-tertiary)] mt-1 uppercase tracking-widest font-semibold">{label}</div>
    </div>
  );
}
