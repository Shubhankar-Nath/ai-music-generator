# Planning Guide

An AI-powered music synthesis and composition tool that generates actual playable audio from tune patterns, themes, and instrument selections. Users can input simple tune patterns (like "paa paa..para paa paa"), select themes (mood/tempo), choose instruments, and the system generates real synthesized music using Web Audio API.

**Experience Qualities**: 
1. **Immediate** - Users should hear their music instantly with real-time audio playback that feels responsive and delightful
2. **Expressive** - The interface should enable musical creativity through simple inputs, translating intuitive patterns into rich, nuanced sounds
3. **Playful** - Interactions should feel experimental and fun, encouraging users to try different tune patterns, themes, and instrument combinations without barriers

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused music synthesis tool with tune pattern parsing, audio generation, instrument selection, and playback controls that work together seamlessly.

## Essential Features

### Tune Pattern Parser
- **Functionality**: Converts text-based tune patterns (e.g., "paa paa..para paa paa") into musical note sequences with rhythm
- **Purpose**: Enables intuitive music input through phonetic/syllabic patterns
- **Trigger**: User types tune pattern in the input field
- **Progression**: User types pattern → Parser analyzes syllables and timing → Converts to notes and durations → Preview shows parsed structure
- **Success criteria**: Parser accurately interprets common patterns, handles variations, and provides clear visual feedback of the interpretation

### Audio Synthesis Engine
- **Functionality**: Generates real-time audio using Web Audio API with multiple instrument voices and effects
- **Purpose**: Transforms parsed musical data into actual playable sound
- **Trigger**: User clicks play button or auto-preview is enabled
- **Progression**: User initiates playback → Engine loads instrument profile → Synthesizes notes with timing → Audio plays through speakers → Visual waveform animates
- **Success criteria**: Audio plays smoothly without glitches, sounds musical and expressive, timing is accurate

### Instrument Library
- **Functionality**: Collection of synthesized instrument profiles including traditional (piano, flute, strings, guitar, bass, organ), percussive (drum), and electric effects (electric, wobble, echo, laser) with distinctive timbres
- **Purpose**: Provides diverse sonic palettes for different musical expressions, from classical to experimental electronic sounds
- **Trigger**: User selects instrument from dropdown or multi-select
- **Progression**: User browses instruments → Previews sound → Selects one or more → Synthesis engine applies instrument characteristics
- **Success criteria**: Each instrument has distinctive, recognizable sound; traditional instruments sound organic while electric effects provide creative electronic textures; multiple instruments can layer together harmoniously

### Theme/Mood System
- **Functionality**: Applies tempo, dynamics, articulation, and harmonic characteristics based on selected theme
- **Purpose**: Automatically enhances the musical output to match desired emotional quality
- **Trigger**: User selects theme (e.g., "slow and fine", "energetic", "mysterious")
- **Progression**: User chooses theme → System adjusts tempo, scales, articulation → Generates or modifies music accordingly → User hears themed result
- **Success criteria**: Themes produce noticeably different musical outputs; adjustments feel appropriate to the theme name

### AI Music Enhancement
- **Functionality**: Uses LLM to intelligently fill in musical gaps, suggest harmonies, add variation, and enhance user input
- **Purpose**: Elevates simple patterns into fuller, more sophisticated compositions
- **Trigger**: Optional enhancement toggle or explicit "enhance" button
- **Progression**: User creates basic tune → Clicks enhance → AI analyzes pattern → Suggests chord progressions, counter-melodies, arrangements → User accepts or modifies
- **Success criteria**: Enhancements sound musical and cohesive with the original input; user maintains creative control

### Music Library & Playback
- **Functionality**: Save generated music pieces, replay them, download as audio files, and organize collections
- **Purpose**: Provides persistence and enables users to build a portfolio of creations
- **Trigger**: User saves after generating music
- **Progression**: User generates music → Clicks save → Names the piece → Stored with all parameters → Can replay, export WAV/MP3, or delete
- **Success criteria**: All saved music persists between sessions, playback is instant, export produces quality audio files

## Edge Case Handling

- **Invalid Tune Patterns**: When users enter unrecognizable patterns, show helpful examples and suggest corrections
- **Empty Inputs**: If no tune/theme/instrument selected, provide quick-start templates and one-click examples
- **Audio Context Issues**: Handle browser audio permissions and autoplay restrictions gracefully with clear user prompts
- **Synthesis Errors**: If audio generation fails, fallback to simpler synthesis and notify user
- **Long Sequences**: Limit tune pattern length to prevent performance issues; show character/note count
- **Overlapping Playback**: Stop previous audio when starting new playback to avoid cacophony
- **Browser Compatibility**: Detect Web Audio API support and show helpful message for unsupported browsers

## Design Direction

The design should evoke the feeling of a creative music studio or synthesizer workstation - vibrant and energetic with visual feedback that responds to sound. It should feel both technical (showing waveforms, frequencies) and artistic (flowing animations, color-coded notes), making audio synthesis feel approachable and magical.

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
