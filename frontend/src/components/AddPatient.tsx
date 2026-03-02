import React from 'react';
import { UserPlus } from 'lucide-react';

export default function AddPatient() {
    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <UserPlus size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Add New Patient</h2>
                    <p className="text-slate-500 text-sm mt-1">Enter patient details to register them in the system.</p>
                </div>
            </div>

            <form className="space-y-8" action="">

                {/* Personal Information Section */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-100">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="name">Full Name</label>
                            <input
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                                type="text"
                                id="name"
                                placeholder="e.g. Jane Doe"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700" htmlFor="age">Age</label>
                                <input
                                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                                    type="number"
                                    id="age"
                                    placeholder="e.g. 34"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700" htmlFor="gender">Gender</label>
                                <select
                                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 appearance-none"
                                    id="gender"
                                >
                                    <option value="" disabled selected>Select...</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-100">Contact Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="phone">Phone Number</label>
                            <input
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                                type="tel"
                                id="phone"
                                placeholder="(555) 000-0000"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="email">Email Address</label>
                            <input
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                                type="email"
                                id="email"
                                placeholder="jane.doe@example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Location Information Section */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-100">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-4">
                            <label className="text-sm font-medium text-slate-700" htmlFor="address">Street Address</label>
                            <input
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                                type="text"
                                id="address"
                                placeholder="123 Main St, Apt 4B"
                            />
                        </div>
                        <div className="flex flex-col gap-2 lg:col-span-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="city">City</label>
                            <input
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                                type="text"
                                id="city"
                                placeholder="New York"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="state">State</label>
                            <input
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                                type="text"
                                id="state"
                                placeholder="NY"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="zip">ZIP Code</label>
                            <input
                                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                                type="text"
                                id="zip"
                                placeholder="10001"
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Information Section */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-100">Additional Information</h3>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700" htmlFor="notes">Medical Notes / Conditions</label>
                        <textarea
                            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 min-h-[120px] resize-y"
                            id="notes"
                            placeholder="Add any relevant medical history, allergies, or ongoing treatments here..."
                        ></textarea>
                    </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                    >
                        <UserPlus size={18} />
                        Register Patient
                    </button>
                </div>

            </form>
        </div>
    );
}