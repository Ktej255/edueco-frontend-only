"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check, Edit, Trash2, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_PLANS = [
    {
        id: 1,
        name: "Pro Monthly",
        status: "active",
        price: 1999,
        interval: "monthly",
        features: [
            "Access to all PRO courses",
            "Exclusive community access",
            "Downloadable resources",
            "Priority support"
        ]
    },
    {
        id: 2,
        name: "test",
        status: "archived",
        price: 999,
        interval: "monthly",
        features: [
            "Access to all PRO courses",
            "Access to all PRO courses"
        ]
    }
];

export default function MembershipsPage() {
    const [plans, setPlans] = useState(MOCK_PLANS);

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Membership Plans
                        </h1>
                        <p className="text-gray-400">
                            Create and manage subscription plans for your students.
                        </p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-500">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Plan
                    </Button>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div key={plan.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <Crown className="h-5 w-5 text-blue-500" />
                                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={plan.status === "active" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}
                                >
                                    {plan.status}
                                </Badge>
                            </div>

                            <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                                Access all PRO courses and exclusive content on a monthly basis.
                            </p>

                            <div className="flex items-baseline mb-6">
                                <span className="text-3xl font-bold text-white">₹{plan.price.toLocaleString()}</span>
                                <span className="text-gray-500 ml-1">/{plan.interval}</span>
                            </div>

                            <div className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                        <span className="text-sm text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-800">
                                <Button variant="outline" className="flex-1 border-gray-700 text-white hover:bg-gray-800">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                                <Button variant="outline" className="flex-1 border-red-900/30 text-red-500 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50 bg-red-950/10">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
