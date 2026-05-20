# Planning Guide

An AI-powered music composition assistant that helps users generate musical ideas, chord progressions, melodies, and complete compositions using advanced music theory knowledge and natural language interactions.

**Experience Qualities**: 
1. **Inspiring** - Users should feel creatively energized by the AI suggestions and feel empowered to explore musical concepts they might not have considered
2. **Educational** - The interface should subtly teach music theory through clear explanations and visual representations of musical concepts
3. **Playful** - Interactions should feel experimental and fun, encouraging users to try different combinations and styles without fear of making mistakes

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused tool with several interconnected features (chord generation, melody creation, composition tools) that work together, but the core interactions remain straightforward and accessible.

## Essential Features

### AI Music Theory Assistant
- **Functionality**: Generates chord progressions, melodies, and composition suggestions based on user prompts using LLM
- **Purpose**: Provides intelligent music creation guidance using deep music theory knowledge
- **Trigger**: User enters a natural language prompt (e.g., "sad piano progression in C minor")
- **Progression**: User types prompt → AI analyzes request → Generates musical content with theory explanation → User sees results with notation
- **Success criteria**: Generated content is musically coherent and matches the user's intent; explanations are clear and educational

### Chord Progression Generator
- **Functionality**: Creates chord sequences based on key, mood, genre, and complexity
- **Purpose**: Helps users quickly establish harmonic foundations for compositions
- **Trigger**: User selects parameters or uses AI prompt
- **Progression**: User defines constraints → System generates progression → Display chords with Roman numeral analysis → User can regenerate or refine
- **Success criteria**: Progressions follow music theory rules and sound musically pleasing

### Melody Generator
- **Functionality**: Creates melodic lines that fit over chord progressions or standalone
- **Purpose**: Provides melodic inspiration and demonstrates how melodies interact with harmony
- **Trigger**: User requests melody with optional chord context
- **Progression**: User specifies style/scale → AI generates melody → Display as note sequence with rhythm → User can modify parameters
- **Success criteria**: Melodies are singable/playable and fit the harmonic context

### Music Knowledge Base
- **Functionality**: Repository of music theory concepts, scales, modes, chord types, and genre characteristics
- **Purpose**: Enables the AI to generate contextually appropriate and theoretically sound suggestions
- **Trigger**: Accessed automatically by AI during generation
- **Progression**: User makes request → System queries knowledge base → Applies relevant theory → Returns informed result
- **Success criteria**: Generated content demonstrates accurate music theory application

### Composition Workspace
- **Functionality**: Allows users to save, organize, and refine their generated musical ideas
- **Purpose**: Provides persistence for creative work and enables iterative refinement
- **Trigger**: User generates content they want to keep
- **Progression**: User generates idea → Clicks save → Idea stored in workspace → User can revisit, modify, or combine ideas
- **Success criteria**: All saved compositions persist between sessions and can be easily managed

## Edge Case Handling

- **Invalid Musical Requests**: When users request impossible combinations (e.g., "major chord in minor key only"), the AI gracefully explains why and suggests alternatives
- **Empty State**: First-time users see inspiring examples and quick-start prompts to guide initial exploration
- **Generation Failures**: If AI generation fails, show helpful error with suggestion to rephrase or simplify the request
- **Long Generation Times**: Display progress indicator and let users cancel if taking too long
- **Conflicting Parameters**: When user selections conflict (e.g., "happy blues in major"), AI resolves intelligently and explains the choice

## Design Direction

The design should evoke the feeling of a sophisticated recording studio or composer's workshop - professional yet inviting, with a sense of creative possibility. It should feel like a premium music production tool that's approachable for beginners but powerful for experienced musicians.

## Color Selection

The color scheme draws inspiration from vintage synthesizers and modern DAWs, combining deep, rich backgrounds with vibrant accent colors that feel electric and musical.

- **Primary Color**: Deep purple `oklch(0.35 0.15 295)` - Represents creativity, musicality, and sophistication; the primary brand color for buttons and key interactions
- **Secondary Colors**: Rich navy `oklch(0.25 0.08 250)` for cards and elevated surfaces; warm charcoal `oklch(0.22 0.01 265)` for deeper backgrounds
- **Accent Color**: Electric cyan `oklch(0.75 0.18 195)` - Attention-grabbing highlight for CTAs, active states, and musical notation elements
- **Foreground/Background Pairings**: 
  - Primary (Deep Purple oklch(0.35 0.15 295)): White text (oklch(0.98 0 0)) - Ratio 7.2:1 ✓
  - Accent (Electric Cyan oklch(0.75 0.18 195)): Dark navy (oklch(0.20 0.08 250)) - Ratio 8.5:1 ✓
  - Background (oklch(0.15 0.02 265)): Light text (oklch(0.92 0.01 265)) - Ratio 12.8:1 ✓

## Font Selection

Typography should convey technical precision while remaining approachable and modern, reflecting both the mathematical nature of music theory and the creative spirit of composition.

- **Typographic Hierarchy**: 
  - H1 (Page Title): Space Grotesk Bold / 32px / -0.02em letter spacing
  - H2 (Section Headers): Space Grotesk Semibold / 24px / -0.01em letter spacing
  - H3 (Card Titles): Space Grotesk Medium / 18px / normal letter spacing
  - Body (Descriptions): Inter Regular / 15px / normal letter spacing / 1.6 line height
  - Musical Notation: JetBrains Mono Medium / 16px / monospace for chords and notes
  - Labels: Inter Medium / 13px / 0.01em letter spacing / uppercase

## Animations

Animations should feel smooth and purposeful, like the physical movements of musical instruments and equipment - subtle mechanical precision with moments of expressive flourish.

- **Content Generation**: Gentle fade-in with slight upward movement (300ms) when AI results appear
- **Chord/Note Interactions**: Quick scale transform (150ms) on hover, with electric glow effect
- **Panel Transitions**: Smooth slide animations (400ms) with easing that mimics physical drawer movement
- **Save Actions**: Satisfying check-mark animation with particle burst effect to celebrate creativity
- **Loading States**: Pulsing musical note icon with rhythmic timing (beat-based animation)

## Component Selection

- **Components**: 
  - `Card` for chord progression displays and melody results with custom gradient backgrounds
  - `Input` and `Textarea` for prompt entry with custom focus states using accent color
  - `Button` extensively with variants for primary (generate), secondary (modify), and ghost (utility actions)
  - `Tabs` for switching between different generation modes (Chords, Melody, Full Composition)
  - `Dialog` for detailed music theory explanations and composition tips
  - `Badge` for displaying musical tags (key, tempo, mood, genre)
  - `ScrollArea` for the composition workspace and knowledge base browser
  - `Separator` to divide sections clearly
  - `Skeleton` for loading states during AI generation

- **Customizations**: 
  - Custom "Musical Card" component that extends Card with notation display capabilities
  - Custom "Chord Display" component showing chord symbols with Roman numeral analysis
  - Custom "Prompt Builder" component with smart suggestions and autocomplete
  - Loading animation using phosphor musical note icons

- **States**: 
  - Buttons: Default has subtle gradient, hover adds glow effect, active scales down slightly, disabled shows muted colors
  - Inputs: Focus state includes electric cyan glow and subtle border pulse
  - Cards: Hover lifts with shadow increase, selected state has accent border glow
  - Generated content: Appears with stagger animation, each chord/note animates in sequence

- **Icon Selection**: 
  - `MusicNotes` for main app icon and musical content
  - `Lightning` for AI generation triggers
  - `Waveform` for melody and audio visualization
  - `Faders` for mixing and parameter adjustment
  - `BookOpen` for knowledge base and theory reference
  - `FloppyDisk` for saving compositions
  - `Sparkle` for AI-powered features
  - `Play` for preview actions

- **Spacing**: 
  - Page padding: `p-6` on mobile, `p-8` on desktop
  - Card padding: `p-6` consistently
  - Component gaps: `gap-4` for related items, `gap-8` for distinct sections
  - Grid layouts: `gap-6` for card grids

- **Mobile**: 
  - Stack tabs vertically on mobile instead of horizontal layout
  - Single column layout for cards on mobile, 2-3 columns on tablet/desktop
  - Bottom sheet drawer for composition workspace instead of side panel
  - Larger touch targets (48px minimum) for all interactive musical elements
  - Collapsible knowledge base section that expands on demand
