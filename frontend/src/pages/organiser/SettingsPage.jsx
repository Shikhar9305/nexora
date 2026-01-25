'use client';

import { useState } from 'react'
import { Save, ShieldCheck } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    organisationName: 'Tech Innovations Inc.',
    organisationType: 'company',
    contactEmail: 'contact@techinnovations.com',
    description: 'We are a leading technology company focused on innovation and digital transformation.',
    website: 'https://techinnovations.com',
    phone: '+91 98765 43210',
    address: '123 Tech Street, Mumbai, India',
  })

  const [isEditing, setIsEditing] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    console.log('[v0] Profile saved:', profile)
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 3000)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your organisation profile</p>
      </div>

      {/* Approval Status */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-green-400" size={24} />
          <div>
            <h3 className="text-green-400 font-bold">Organisation Approved</h3>
            <p className="text-green-300 text-sm mt-1">Your organisation has been verified and approved by our admin team.</p>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
        {/* Organisation Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Organisation Name</label>
          <input 
            type="text"
            name="organisationName"
            value={profile.organisationName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Organisation Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Organisation Type</label>
          <select 
            name="organisationType"
            value={profile.organisationType}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-500 transition"
          >
            <option value="college">College/University</option>
            <option value="company">Company</option>
            <option value="community">Community</option>
          </select>
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Contact Email</label>
          <input 
            type="email"
            name="contactEmail"
            value={profile.contactEmail}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
          <input 
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
          <input 
            type="url"
            name="website"
            value={profile.website}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
          <input 
            type="text"
            name="address"
            value={profile.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Organisation Description</label>
          <textarea 
            name="description"
            value={profile.description}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows="4"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-500 transition resize-none"
          ></textarea>
        </div>

        {/* Save Messages */}
        {savedMessage && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 text-sm">
            ✓ Settings saved successfully!
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-700">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-cyan-500 rounded-lg text-white hover:bg-cyan-600 transition font-medium"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 rounded-lg text-white hover:bg-green-600 transition font-medium"
              >
                <Save size={18} />
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition font-medium"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8">
        <h3 className="text-red-400 font-bold mb-4">Danger Zone</h3>
        <p className="text-slate-300 text-sm mb-4">Once you delete your organisation, there is no going back. Please be certain.</p>
        <button className="px-6 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition font-medium">
          Delete Organisation
        </button>
      </div>
    </div>
  )
}
