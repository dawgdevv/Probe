import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { listProjects, createProject, type Project } from '../api/client';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: listProjects,
  });

  const mutation = useMutation({
    mutationFn: () => createProject(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowForm(false);
      setName('');
      setDescription('');
      toast.success('Project created');
    },
    onError: () => toast.error('Failed to create project'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-0">Projects</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white hover:bg-[var(--accent-hover)] text-black px-4 py-2 rounded text-xs font-semibold transition-all cursor-pointer border-none uppercase tracking-wider"
        >
          + New Project
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-5 mb-8"
        >
          <div className="mb-4">
            <label className="block text-[10px] text-[var(--text-secondary)] mb-1.5 uppercase tracking-widest font-semibold">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My API Tests"
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2.5 text-[var(--text-primary)] text-sm outline-none focus:border-[var(--border-hover)] placeholder:text-[var(--text-tertiary)] transition-colors"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-[10px] text-[var(--text-secondary)] mb-1.5 uppercase tracking-widest font-semibold">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2.5 text-[var(--text-primary)] text-sm outline-none focus:border-[var(--border-hover)] placeholder:text-[var(--text-tertiary)] transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-white hover:bg-[var(--accent-hover)] text-black px-4 py-2 rounded text-xs font-semibold cursor-pointer border-none transition-all disabled:opacity-50 uppercase tracking-wider"
            >
              {mutation.isPending ? 'Creating...' : 'Create'}
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
      ) : !projects || projects.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[var(--border)] rounded">
          <div className="w-10 h-10 mx-auto mb-4 border border-[var(--border)] rounded flex items-center justify-center">
            <span className="text-[var(--text-tertiary)] text-lg">+</span>
          </div>
          <p className="text-[var(--text-secondary)] text-sm mb-1">No projects yet</p>
          <p className="text-[var(--text-tertiary)] text-xs">
            Create a project to start organizing your API tests
          </p>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: Project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-5 no-underline transition-all hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)]"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-[var(--text-primary)] text-sm font-semibold m-0 tracking-tight">
                  {project.name}
                </h3>
                <span className="text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors text-xs">→</span>
              </div>
              <p className="text-[var(--text-secondary)] text-xs m-0 leading-relaxed">
                {project.description || 'No description'}
              </p>
              <div className="mt-4 pt-3 border-t border-[var(--border)]">
                <p className="text-[var(--text-tertiary)] text-[10px] m-0 font-['JetBrains_Mono'] uppercase tracking-wider">
                  {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
