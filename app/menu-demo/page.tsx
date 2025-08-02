"use client"

import React from 'react';
import { InteractiveMenu, InteractiveMenuItem } from "@/components/ui/modern-mobile-menu";
import { Home, Briefcase, Calendar, Shield, Settings, User, Heart, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const lucideDemoMenuItems: InteractiveMenuItem[] = [
    { label: 'home', icon: Home },
    { label: 'strategy', icon: Briefcase },
    { label: 'period', icon: Calendar },
    { label: 'security', icon: Shield },
    { label: 'settings', icon: Settings },
];

const customMenuItems: InteractiveMenuItem[] = [
    { label: 'profile', icon: User },
    { label: 'favorites', icon: Heart },
    { label: 'premium', icon: Star },
    { label: 'power', icon: Zap },
];

const customAccentColor = 'var(--chart-2)';
const customAccentColor2 = 'var(--chart-1)';

export default function MenuDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Modern Mobile Menu Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A responsive, interactive menu component optimized for both desktop and mobile devices.
            Features smooth animations, touch-friendly design, and customizable styling.
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {/* Default Menu */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Default Menu
                <Badge variant="secondary">Default</Badge>
              </CardTitle>
              <CardDescription>
                Uses default items and styling with system accent colors
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <InteractiveMenu />
            </CardContent>
          </Card>

          {/* Custom Menu */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Custom Menu
                <Badge variant="outline">Custom Items</Badge>
              </CardTitle>
              <CardDescription>
                Custom menu items with different icons and accent color
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <InteractiveMenu 
                items={lucideDemoMenuItems} 
                accentColor={customAccentColor} 
              />
            </CardContent>
          </Card>

          {/* Alternative Menu */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Alternative Menu
                <Badge variant="destructive">Alternative</Badge>
              </CardTitle>
              <CardDescription>
                Different menu items with alternative accent color
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <InteractiveMenu 
                items={customMenuItems} 
                accentColor={customAccentColor2} 
              />
            </CardContent>
          </Card>

          {/* Features Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Key features of the modern mobile menu component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✅ Responsive Design</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Optimized for both desktop and mobile devices with touch-friendly interactions
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✅ Smooth Animations</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Icon bounce animations and smooth transitions for active states
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✅ Customizable</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Custom menu items, icons, and accent colors with TypeScript support
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✅ Accessibility</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Proper ARIA labels, keyboard navigation, and focus management
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✅ Dark Mode</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Automatic dark mode support with CSS custom properties
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✅ Performance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Optimized with React hooks and efficient re-renders
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
              <CardDescription>
                How to use the InteractiveMenu component in your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Usage:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
{`import { InteractiveMenu } from "@/components/ui/modern-mobile-menu";

<InteractiveMenu />`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Custom Menu:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
{`import { InteractiveMenu, InteractiveMenuItem } from "@/components/ui/modern-mobile-menu";
import { Home, User, Settings } from 'lucide-react';

const customItems: InteractiveMenuItem[] = [
  { label: 'home', icon: Home },
  { label: 'profile', icon: User },
  { label: 'settings', icon: Settings },
];

<InteractiveMenu 
  items={customItems} 
  accentColor="var(--chart-2)" 
/>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 