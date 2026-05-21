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

The design should evoke the feeling of a cute Korean high school music club - youthful, bright, and cheerful with a soft, friendly aesthetic. Imagine pastel notebooks, cute stickers, bubbly handwriting, and the warm atmosphere of after-school activities. The interface should feel approachable, fun, and kawaii while maintaining functionality.

## Color Selection

The color scheme draws inspiration from Korean stationery, school uniforms, and youth culture - soft pastels with pops of vibrant color that feel fresh, clean, and energetic.

- **Primary Color**: Soft pink `oklch(0.75 0.15 15)` - Represents youth, warmth, and creativity; the primary brand color for main actions and highlights
- **Secondary Colors**: Sky blue `oklch(0.80 0.10 230)` for cards and complementary elements; cream `oklch(0.95 0.02 85)` for soft backgrounds
- **Accent Color**: Peach coral `oklch(0.72 0.18 40)` - Cheerful highlight for CTAs, active states, and playful elements
- **Foreground/Background Pairings**: 
  - Primary (Soft Pink oklch(0.75 0.15 15)): Deep navy (oklch(0.20 0.02 280)) - Ratio 6.8:1 ✓
  - Accent (Peach Coral oklch(0.72 0.18 40)): Deep navy (oklch(0.20 0.02 280)) - Ratio 6.5:1 ✓
  - Background (Cream oklch(0.98 0.01 85)): Dark text (oklch(0.25 0.02 280)) - Ratio 14.2:1 ✓

## Font Selection

Typography should be soft, rounded, and friendly - evoking the feeling of cute Korean handwriting and school notes while maintaining readability.

- **Typographic Hierarchy**: 
  - H1 (Page Title): Gaegu Bold / 40px / normal letter spacing
  - H2 (Section Headers): Gaegu Regular / 28px / normal letter spacing
  - H3 (Card Titles): Gaegu Regular / 20px / normal letter spacing
  - Body (Descriptions): Noto Sans KR Regular / 15px / normal letter spacing / 1.7 line height
  - Musical Notation: JetBrains Mono Medium / 16px / monospace for patterns
  - Labels: Noto Sans KR Medium / 13px / 0.02em letter spacing

## Animations

Animations should feel bouncy, playful, and cute - like stickers being placed, pages turning, or hearts floating up. Movements should have a slight overshoot (spring physics) that adds to the charm.

- **Content Generation**: Gentle bounce-in from bottom with slight rotation (350ms) when content appears
- **Button Interactions**: Quick scale-up bounce (120ms) on hover, with soft shadow lift
- **Panel Transitions**: Playful slide with spring easing (400ms) that slightly overshoots before settling
- **Save Actions**: Cute heart or star burst animation with celebratory confetti effect
- **Loading States**: Rotating musical notes with gentle bob animation, feels cheerful and light
- **Hover Effects**: Subtle float upward movement with soft glow, like highlighting with a marker

## Component Selection

- **Components**: 
  - `Card` with rounded corners and soft shadows for music displays with pastel gradient backgrounds
  - `Input` and `Textarea` with cute rounded styling and soft focus states
  - `Button` with rounded, bubbly appearance and subtle shadows - primary uses pink/peach tones
  - `Tabs` styled like cute notebook tabs or sticky notes
  - `Dialog` for tips and help with friendly, encouraging language
  - `Badge` for displaying music info, styled like colorful school stickers
  - `ScrollArea` for the composition workspace
  - `Separator` as dotted or dashed lines, like notebook paper
  
- **Customizations**: 
  - Custom pastel gradient backgrounds with subtle patterns (dots, stripes, or grid like school notebook paper)
  - Rounded corners everywhere (large radius for softness)
  - Soft drop shadows instead of harsh borders
  - Cute emoji and icon combinations throughout
  - Decorative elements like stars, hearts, and music note doodles

- **States**: 
  - Buttons: Default has soft pastel gradient, hover bounces slightly and glows, active squishes down, disabled shows light gray
  - Inputs: Focus state includes soft pink/peach glow with gentle pulse animation
  - Cards: Hover lifts gently with increased soft shadow, like lifting a piece of paper
  - Generated content: Appears with playful bounce animation, staggered timing

- **Icon Selection**: 
  - `Heart` and `Sparkle` for favorites and special features
  - `Smiley` for friendly interactions
  - `MusicNotes` with filled weight for musical content
  - `Star` for ratings and highlights
  - `FloppyDisk` for saving
  - `Play` with filled weight for playback
  - All icons use soft, rounded filled style when available

- **Spacing**: 
  - Page padding: `p-4` on mobile, `p-6` on tablet, `p-8` on desktop
  - Card padding: `p-5` to `p-6` consistently for comfort
  - Component gaps: `gap-3` for tight grouping, `gap-6` for section separation
  - Grid layouts: `gap-4` for cozy card grids

- **Mobile**: 
  - Stack everything vertically with generous spacing
  - Large, friendly touch targets (min 48px)
  - Bottom navigation if needed, styled like app tabs
  - Cards take full width on mobile for easy reading
  - Collapsible sections with cute icons to indicate state
