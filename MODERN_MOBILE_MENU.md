# Modern Mobile Menu Component

A responsive, interactive menu component optimized for both desktop and mobile devices. Built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ **Responsive Design** - Optimized for both desktop and mobile devices
- ✅ **Smooth Animations** - Icon bounce animations and smooth transitions
- ✅ **Customizable** - Custom menu items, icons, and accent colors
- ✅ **Accessibility** - Proper ARIA labels and keyboard navigation
- ✅ **Dark Mode** - Automatic dark mode support
- ✅ **Performance** - Optimized with React hooks and efficient re-renders
- ✅ **Touch-Friendly** - Optimized for mobile touch interactions

## Installation

The component is already integrated into the project. Dependencies are already installed:

- `lucide-react` - For icons
- `react` - For React hooks
- `typescript` - For type safety

## Usage

### Basic Usage

```tsx
import { InteractiveMenu } from "@/components/ui/modern-mobile-menu";

<InteractiveMenu />
```

### Custom Menu

```tsx
import { InteractiveMenu, InteractiveMenuItem } from "@/components/ui/modern-mobile-menu";
import { Home, User, Settings } from 'lucide-react';

const customItems: InteractiveMenuItem[] = [
  { label: 'home', icon: Home },
  { label: 'profile', icon: User },
  { label: 'settings', icon: Settings },
];

<InteractiveMenu 
  items={customItems} 
  accentColor="var(--chart-2)" 
/>
```

## Props

### InteractiveMenuProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `InteractiveMenuItem[]` | Default items | Array of menu items with icons |
| `accentColor` | `string` | `var(--component-active-color-default)` | CSS custom property for active color |

### InteractiveMenuItem

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display text for the menu item |
| `icon` | `React.ElementType` | Lucide React icon component |

## Default Items

The component comes with 5 default menu items:

1. **Home** - `Home` icon
2. **Strategy** - `Briefcase` icon  
3. **Period** - `Calendar` icon
4. **Security** - `Shield` icon
5. **Settings** - `Settings` icon

## CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  --component-inactive-color: var(--muted-foreground);
  --component-bg: var(--card);
  --component-shadow: var(--border);
  --component-active-bg: var(--secondary);
  --component-line-inactive-color: var(--border);
  --component-active-color-default: var(--accent-foreground);
}
```

## Demo Pages

- **Main Demo**: Visit `/menu-demo` to see the full demo with multiple examples
- **Integration Demo**: The main page (`/`) includes a small demo section

## Mobile Optimizations

- Touch-friendly button sizes (44px minimum)
- Smooth touch interactions
- Optimized spacing for mobile screens
- Reduced icon and text sizes on mobile
- Proper touch-action CSS properties

## Browser Support

- Modern browsers with CSS custom properties support
- Mobile browsers with touch event support
- Progressive enhancement for older browsers

## Performance

- Uses `useMemo` for expensive calculations
- Efficient re-renders with React hooks
- CSS animations for smooth performance
- Minimal JavaScript overhead

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- High contrast support

## Integration Examples

### Floating Navigation Bar

```tsx
import { ModernFloatingNavbar } from "@/components/modern-floating-navbar";

// Replace the existing FloatingNavbar with ModernFloatingNavbar
<ModernFloatingNavbar />
```

### Custom Integration

```tsx
import { InteractiveMenu, InteractiveMenuItem } from "@/components/ui/modern-mobile-menu";

const navigationItems: InteractiveMenuItem[] = [
  { label: 'dashboard', icon: BarChart3 },
  { label: 'projects', icon: Folder },
  { label: 'analytics', icon: TrendingUp },
  { label: 'settings', icon: Settings },
];

<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
  <InteractiveMenu items={navigationItems} />
</div>
```

## Troubleshooting

### Common Issues

1. **Icons not showing**: Make sure `lucide-react` is installed
2. **TypeScript errors**: Check that all imports are correct
3. **Styling issues**: Ensure CSS custom properties are defined
4. **Mobile not working**: Check touch event handlers and CSS

### Debug Mode

Add `console.log` statements in the component to debug:

```tsx
console.log('Menu items:', finalItems);
console.log('Active index:', activeIndex);
```

## Contributing

To modify the component:

1. Edit `components/ui/modern-mobile-menu.tsx`
2. Update styles in `app/globals.css`
3. Test on both desktop and mobile
4. Update documentation if needed

## License

This component is part of the project and follows the same license terms. 