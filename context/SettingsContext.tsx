"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

type Theme = 'Dark Neural' | 'Cyber Ghost' | 'Deep Void';

interface NotificationSettings {
    velocityAlerts: boolean;
    metricMilestones: boolean;
    neuralSummaries: boolean;
    systemAnomalies: boolean;
}

interface SecuritySettings {
    sessionTimeout: string;
}

interface Settings {
    theme: Theme;
    glassIntensity: number;
    neonAccents: boolean;
    notifications: NotificationSettings;
    security: SecuritySettings;
}

interface SettingsContextType {
    settings: Settings;
    updateSettings: (updates: Partial<Settings>) => Promise<void>;
    isLoading: boolean;
}

const defaultSettings: Settings = {
    theme: 'Dark Neural',
    glassIntensity: 75,
    neonAccents: true,
    notifications: {
        velocityAlerts: true,
        metricMilestones: true,
        neuralSummaries: false,
        systemAnomalies: false,
    },
    security: {
        sessionTimeout: '24 Hours',
    },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        if (status !== 'authenticated') return;

        try {
            const response = await fetch('/api/user/settings');
            if (response.ok) {
                const data = await response.json();
                if (data.settings) {
                    setSettings(data.settings);
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setIsLoading(false);
        }
    }, [status]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSettings = async (updates: Partial<Settings>) => {
        // Optimistic update
        const newSettings = { ...settings, ...updates };
        setSettings(newSettings);

        try {
            const response = await fetch('/api/user/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: updates }),
            });

            if (!response.ok) {
                // Rollback on failure
                setSettings(settings);
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            // Re-fetch to ensure sync
            fetchSettings();
        }
    };

    useEffect(() => {
        const root = document.documentElement;

        // Apply variables
        root.style.setProperty('--glass-intensity', (settings.glassIntensity / 100).toString());
        root.style.setProperty('--neon-opacity', settings.neonAccents ? '1' : '0');

        // Apply theme classes
        root.classList.remove('theme-cyber-ghost', 'theme-deep-void');
        if (settings.theme === 'Cyber Ghost') root.classList.add('theme-cyber-ghost');
        if (settings.theme === 'Deep Void') root.classList.add('theme-deep-void');
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
