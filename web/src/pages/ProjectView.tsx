import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getProject, listSuites, createSuite, type TestSuite } from '../api/client';

export default function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>();
  const id = Number(projectId);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [yamlContent, setYamlContent] = useState(DEFAULT_YAML);

  const { data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
  });

  const { data: suites, isLoading } = useQuery({
    queryKey: ['suites', id],
    queryFn: () => listSuites(id),
  });

  const mutation = useMutation({
    mutationFn: () => createSuite(id, name, yamlContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suites', id] });
      setShowForm(false);
      setName('');
      setYamlContent(DEFAULT_YAML);
      toast.success('Test suite created');
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.error || 'Failed to create suite'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !yamlContent.trim()) return;
    mutation.mutate();
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-6 font-['JetBrains_Mono'] uppercase tracking-wider">
        <Link to="/" className="hover:text-[var(--text-primary)] no-underline text-[var(--text-tertiary)] transition-colors">
          Projects
        </Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">{project?.name ?? '...'}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">{project?.name}</h2>
          {project?.description && (
            <p className="text-[var(--text-secondary)] text-sm m-0">{project.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white hover:bg-[var(--accent-hover)] text-black px-4 py-2 rounded text-xs font-semibold transition-all cursor-pointer border-none uppercase tracking-wider"
        >
          + New Suite
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-5 mb-8"
        >
          <div className="mb-4">
            <label className="block text-[10px] text-[var(--text-secondary)] mb-1.5 uppercase tracking-widest font-semibold">
              Suite Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. User API Tests"
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2.5 text-[var(--text-primary)] text-sm outline-none focus:border-[var(--border-hover)] placeholder:text-[var(--text-tertiary)] transition-colors"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-[10px] text-[var(--text-secondary)] mb-1.5 uppercase tracking-widest font-semibold">
              YAML Test Definition
            </label>
            <textarea
              value={yamlContent}
              onChange={(e) => setYamlContent(e.target.value)}
              rows={16}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2.5 text-[var(--text-primary)] text-sm font-['JetBrains_Mono'] outline-none focus:border-[var(--border-hover)] resize-y placeholder:text-[var(--text-tertiary)] transition-colors leading-relaxed"
              spellCheck={false}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-white hover:bg-[var(--accent-hover)] text-black px-4 py-2 rounded text-xs font-semibold cursor-pointer border-none transition-all disabled:opacity-50 uppercase tracking-wider"
            >
              {mutation.isPending ? 'Creating...' : 'Create Suite'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-transparent text-[var(--text-secondary)] px-4 py-2 rounded text-xs cursor-pointer border border-[var(--border)] transition-all hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] uppercase tracking-wider font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-[var(--text-secondary)] text-center py-20 text-sm">Loading...</div>
      ) : !suites || suites.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[var(--border)] rounded">
          <div className="w-10 h-10 mx-auto mb-4 border border-[var(--border)] rounded flex items-center justify-center">
            <span className="text-[var(--text-tertiary)] text-lg">+</span>
          </div>
          <p className="text-[var(--text-secondary)] text-sm mb-1">No test suites yet</p>
          <p className="text-[var(--text-tertiary)] text-xs">
            Create a test suite with your YAML test definitions
          </p>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
          {suites.map((suite: TestSuite) => (
            <Link
              key={suite.id}
              to={`/suites/${suite.id}`}
              className="group bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-5 no-underline transition-all hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)]"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-[var(--text-primary)] text-sm font-semibold m-0 tracking-tight">
                  {suite.name}
                </h3>
                <span className="text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors text-xs">→</span>
              </div>
              <p className="text-[var(--text-tertiary)] text-[10px] m-0 font-['JetBrains_Mono'] uppercase tracking-wider">
                Updated {new Date(suite.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const DEFAULT_YAML = `env:
  base_url: https://jsonplaceholder.typicode.com

tests:
  - name: Get all posts
    request:
      method: GET
      path: /posts
    expect:
      status: 200

  - name: Get single post
    request:
      method: GET
      path: /posts/1
    expect:
      status: 200
`;
