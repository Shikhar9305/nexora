'use client';

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Users } from "lucide-react"
import MatchmakingProfileForm from "../../components/matchmaking/MatchmakingProfileForm.jsx"
import TeammateCard from "../../components/matchmaking/TeammateCard.jsx"
import InvitationPanel from "../../components/matchmaking/InvitationPanel.jsx"
import CreateTeamModal from "../../components/matchmaking/CreateTeamModal.jsx"
import InviteUserModal from "../../components/matchmaking/InviteUserModal.jsx"

export default function EventTeammatesPage() {
  const { id: eventId } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [loadingEvent, setLoadingEvent] = useState(true)

  const [profileCompleted, setProfileCompleted] = useState(false)
  const [pool, setPool] = useState([])
  const [poolLoading, setPoolLoading] = useState(false)
  const [poolError, setPoolError] = useState(null)

  const [currentTeam, setCurrentTeam] = useState(null)
  const [createTeamOpen, setCreateTeamOpen] = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)

  const userId = localStorage.getItem("userId")
  useEffect(() => {
    const verifyProfile = async () => {
      try {
        const res = await fetch(
          `/api/matchmaking/profile/${eventId}?userId=${userId}`
        )
  
        if (!res.ok) {
          setProfileCompleted(false)
          return
        }
  
        const data = await res.json()
        setProfileCompleted(Boolean(data.profile))
      } catch {
        setProfileCompleted(false)
      }
    }
  
    if (userId && eventId) {
      verifyProfile()
    }
  }, [eventId, userId])
  

  const profileKey = `matchmaking_profile_${eventId}`

  useEffect(() => {

    

    const fetchEvent = async () => {
      setLoadingEvent(true)
      try {
        const res = await fetch(`/api/events/${eventId}`)
        if (!res.ok) throw new Error("Failed to load event")
        const data = await res.json()
        setEvent(data)
      } catch (err) {
        console.error("[matchmaking] Failed to load event", err)
        setEvent(null)
      } finally {
        setLoadingEvent(false)
      }
    }

    if (eventId) fetchEvent()
  }, [eventId])

  const loadMyTeam = async () => {
    try {
      const res = await fetch(`/api/teams/my/${eventId}?userId=${userId}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setCurrentTeam(null)
        return
      }
      setCurrentTeam(data.team || null)
    } catch {
      setCurrentTeam(null)
    }
  }

  useEffect(() => {
    if (userId && eventId) {
      loadMyTeam()
    }
  }, [userId, eventId])

  const loadPool = async () => {
    if (!userId || !eventId) return
    setPoolLoading(true)
    setPoolError(null)
    try {
      const res = await fetch(`/api/matchmaking/pool/${eventId}?userId=${userId}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch curated pool")
      }
      setPool(data.profiles || [])
    } catch (err) {
      setPoolError(err.message)
      setPool([])
    } finally {
      setPoolLoading(false)
    }
  }

  useEffect(() => {
    if (profileCompleted) {
      loadPool()
        
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileCompleted, eventId])

  const handleProfileCompleted = () => {
    setProfileCompleted(true)
    loadPool()
  }

  const handleOpenInvite = (profile) => {
    if (!currentTeam) {
      setCreateTeamOpen(true)
      return
    }
    setSelectedProfile(profile)
    setInviteModalOpen(true)
  }

  const isTeamLeader = currentTeam && String(currentTeam.leaderId) === String(userId)

  const handlePoolChanged = () => {
    loadPool()
    loadMyTeam()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(`/event/${eventId}`)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to event</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Smart, controlled matchmaking – no spam, no global lists.</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {loadingEvent ? (
          <p className="text-sm text-slate-400">Loading event...</p>
        ) : !event ? (
          <p className="text-sm text-red-300">
            Could not load event details. Go back and try again.
          </p>
        ) : (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">{event.title}</h1>
            <p className="text-sm text-slate-400 mt-1">
              {event.organisationName} • Hackathon teammate matchmaking
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!profileCompleted ? (
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                <MatchmakingProfileForm
                  eventId={eventId}
                  onCompleted={handleProfileCompleted}
                />
              </div>
            ) : (
              <>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Curated teammates for this hackathon
                    </h2>
                    <p className="text-xs text-slate-400">
                      We favour complementary skills, balanced levels, diversity, and fair
                      exposure. You never see a global list.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={loadPool}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-xs text-slate-200 hover:border-slate-500 transition"
                    >
                      Refresh pool
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateTeamOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 text-xs text-white hover:bg-cyan-600 transition"
                    >
                      {currentTeam ? "View / edit team" : "Create team"}
                    </button>
                  </div>
                </div>

                {poolError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-xs rounded-lg p-3">
                    {poolError}
                  </div>
                )}

                {poolLoading ? (
                  <p className="text-xs text-slate-400">Loading curated matches...</p>
                ) : pool.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    No suggestions at the moment. As more people join the pool, you&apos;ll see
                    compatible teammates here.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pool.map((profile) => (
                      <TeammateCard
                        key={profile._id}
                        profile={profile}
                        onInvite={isTeamLeader ? handleOpenInvite : undefined}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <InvitationPanel eventId={eventId} onChanged={handlePoolChanged} />
          </div>
        </div>
      </div>

      <CreateTeamModal
        eventId={eventId}
        isOpen={createTeamOpen}
        onClose={() => setCreateTeamOpen(false)}
        onCreated={(team) => setCurrentTeam(team)}
      />

      <InviteUserModal
        team={currentTeam}
        targetProfile={selectedProfile}
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvited={handlePoolChanged}
      />
    </div>
  )
}

