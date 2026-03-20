import React from 'react';
import { useTheme } from '../context/ThemeContext';

// ─── Import all theme components ─────────────────────────────────────────────
import {
  TwinklingStars, GalaxySpiral, ShootingStars, NebulaClouds,
  FloatingPlanets, AsteroidField, BlackHole, Constellations,
} from './themes/WebSpaceThemes';

import {
  OceanWaves, UnderwaterBubbles, SeaShore, CoralReef,
  JellyfishGlow, WaterRipple, RainRipples, FloatingBoat,
  FallingLeaves, CherryPetals, MovingClouds, Fireflies,
} from './themes/WebNatureThemes';

import {
  SnowfallScene, ButterfliesGarden, GrassWind, SunriseSky,
  GlassOrbs, LiquidGradient, NeonLines, ParticleNetwork,
  ThreeDCubes, SmokeWaves, EnergyWaves, AuroraLights,
  MatrixRain, CircuitGlow, NeuralNetwork, HologramGrid,
  DataStreams, RadarScan, FloatingBalloons, PaperPlanes,
} from './themes/WebTechThemes';

import {
  BusWindowRain, TrainWindow, MetroRide, BikeRidePOV,
  HighwaySunset, AutoRickshaw, PlaneTakeoff, NeonTaxi,
  TerraceF, RoadTripFriends,
} from './themes/WebStreetThemesA';

import {
  BeachBonfire, CollegeWalk, RooftopParty, RainWalk,
  SunsetSilhouette, StreetFood, MarketCrowd, CityTimelapse,
  RainReflection, ZebraCrossing,
} from './themes/WebStreetThemesB';

import {
  StreetMusician, EmptyNightRoad, DeliveryRide, StreetDogs,
  WindowThinking, TrainGoodbye, LonelyWalk, CityTopView,
  BusStopRain, SunriseCity,
} from './themes/WebStreetThemesC';

import {
  TrainBridge, RailwayPlatform, TruckNight, BoatRide,
  LoFiWindow, NeonAlley, FogStreet, FestivalLights,
  FerrisWheel, SlowTraffic,
} from './themes/WebStreetThemesD';

// ─── Fallback gradient for non-animated themes ──────────────────────────────
const GradientFallback: React.FC<{ colors: string[] }> = ({ colors }) => (
  <div
    style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      background: `linear-gradient(135deg, ${colors.join(', ')})`,
    }}
  />
);

// ─── THEME MAP ───────────────────────────────────────────────────────────────
const THEME_MAP: Record<string, React.FC> = {
  // 1-8: Space & Cosmos
  twinkling_stars: TwinklingStars,
  galaxy_spiral: GalaxySpiral,
  shooting_stars: ShootingStars,
  nebula_clouds: NebulaClouds,
  floating_planets: FloatingPlanets,
  asteroid_field: AsteroidField,
  black_hole: BlackHole,
  constellation: Constellations,

  // 9-20: Nature & Water
  ocean_waves: OceanWaves,
  underwater_bubbles: UnderwaterBubbles,
  sea_shore: SeaShore,
  coral_reef: CoralReef,
  deep_sea_glow: JellyfishGlow,
  water_ripple: WaterRipple,
  rain_on_water: RainRipples,
  floating_boats: FloatingBoat,
  floating_leaves: FallingLeaves,
  cherry_blossom: CherryPetals,
  moving_clouds: MovingClouds,
  forest_fireflies: Fireflies,

  // 21-40: Tech & Abstract
  snowfall: SnowfallScene,
  butterflies: ButterfliesGarden,
  grass_sway: GrassWind,
  sunrise_gradient: SunriseSky,
  glass_orbs: GlassOrbs,
  liquid_gradient: LiquidGradient,
  neon_lines: NeonLines,
  particle_network: ParticleNetwork,
  floating_cubes: ThreeDCubes,
  colorful_smoke: SmokeWaves,
  energy_waves: EnergyWaves,
  aurora_borealis: AuroraLights,
  digital_matrix: MatrixRain,
  circuit_glow: CircuitGlow,
  ai_network: NeuralNetwork,
  holographic_grid: HologramGrid,
  data_stream: DataStreams,
  radar_scan: RadarScan,
  floating_balloons: FloatingBalloons,
  paper_planes: PaperPlanes,

  // 41-50: Street & Travel A
  bus_window_rain: BusWindowRain,
  train_window: TrainWindow,
  metro_ride: MetroRide,
  bike_ride_pov: BikeRidePOV,
  highway_sunset: HighwaySunset,
  auto_rickshaw: AutoRickshaw,
  plane_takeoff: PlaneTakeoff,
  neon_taxi: NeonTaxi,
  terrace_friends: TerraceF,
  road_trip_friends: RoadTripFriends,

  // 51-60: Street & Travel B
  beach_bonfire: BeachBonfire,
  college_walk: CollegeWalk,
  rooftop_party: RooftopParty,
  rain_walk: RainWalk,
  sunset_silhouette: SunsetSilhouette,
  street_food: StreetFood,
  market_crowd: MarketCrowd,
  city_timelapse: CityTimelapse,
  rain_reflection: RainReflection,
  zebra_crossing: ZebraCrossing,

  // 61-70: Street & Travel C
  street_musician: StreetMusician,
  empty_night_road: EmptyNightRoad,
  delivery_ride: DeliveryRide,
  street_dogs: StreetDogs,
  window_thinking: WindowThinking,
  train_goodbye: TrainGoodbye,
  lonely_walk: LonelyWalk,
  city_top_view: CityTopView,
  bus_stop_rain: BusStopRain,
  sunrise_city: SunriseCity,

  // 71-80: Street & Travel D
  train_bridge: TrainBridge,
  subway_rush: RailwayPlatform,
  truck_night: TruckNight,
  boat_ride: BoatRide,
  lofi_window: LoFiWindow,
  neon_alley: NeonAlley,
  fog_street: FogStreet,
  festival_lights: FestivalLights,
  ferris_wheel: FerrisWheel,
  slow_traffic: SlowTraffic,
};

// ─── Solid light/dark fallbacks ───────────────────────────────────────────────
const GRADIENT_FALLBACKS: Record<string, string[]> = {
  default:    ['#1e293b', '#0f172a'],
  light:      ['#f8fafc', '#e2e8f0'],
  dark:       ['#0f172a', '#020617'],
  purple:     ['#4c1d95', '#2e1065'],
  ocean:      ['#0c4a6e', '#082f49'],
  forest:     ['#14532d', '#052e16'],
  sunset:     ['#7c2d12', '#fbbf24'],
  neon:       ['#0f172a', '#4f46e5'],
  vintage:    ['#44403c', '#1c1917'],
  cyberpunk:  ['#020617', '#6d28d9'],
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const AnimatedBackground: React.FC = () => {
  const { currentMode } = useTheme();

  // Check if the current theme has a dedicated animated component
  const ThemeComponent = THEME_MAP[currentMode];

  if (ThemeComponent) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        width: '100vw', height: '100vh',
        overflow: 'hidden', pointerEvents: 'none',
      }}>
        <ThemeComponent />
      </div>
    );
  }

  // Fallback for static / gradient themes
  const fallbackColors = GRADIENT_FALLBACKS[currentMode] ?? GRADIENT_FALLBACKS.default;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      width: '100vw', height: '100vh',
      pointerEvents: 'none',
    }}>
      <GradientFallback colors={fallbackColors} />
    </div>
  );
};

export default AnimatedBackground;
