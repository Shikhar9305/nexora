export default function TeammateCard({ profile, onInvite }) {
  const {
    userId,
    skills = [],
    desiredRoles = [],
    experienceLevel,
    location,
    compatibilityScore,
  } = profile

  const levelLabel =
    experienceLevel === "advanced"
      ? "Advanced"
      : experienceLevel === "intermediate"
        ? "Intermediate"
        : "Beginner"

  return (
    <div className="border border-slate-700 bg-slate-900 rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-white text-sm">
            Participant
            <span className="text-xs text-slate-400 ml-2">
              #{String(userId).slice(-6)}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {levelLabel} •{" "}
            {location && location.trim().length ? location : "Location flexible"}
          </p>
        </div>
        {typeof compatibilityScore === "number" && (
          <span className="px-2 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/40">
            Match score: {Math.round(compatibilityScore)}
          </span>
        )}
      </div>

      {skills.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 mb-1">Key skills</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-200 border border-slate-700"
              >
                {skill}
              </span>
            ))}
            {skills.length > 6 && (
              <span className="text-[11px] text-slate-500">+{skills.length - 6} more</span>
            )}
          </div>
        </div>
      )}

      {desiredRoles.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 mb-1">Interested roles</p>
          <div className="flex flex-wrap gap-1.5">
            {desiredRoles.map((role) => (
              <span
                key={role}
                className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-200 border border-slate-700"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => onInvite?.(profile)}
        className="mt-1 inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500 text-white hover:bg-cyan-600 transition"
      >
        Invite to team
      </button>
    </div>
  )
}

