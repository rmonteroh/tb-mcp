// Core API Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Media Plan Types
export interface MediaPlanConfigDto {
  digital: boolean;
  geo: boolean;
  influencer: boolean;
  ooh: boolean;
  analog: boolean;
}

export interface GenerateMediaPlanDto {
  artistId: string;
  venue: string;
  totalBudget: number;
  startDate: string;
  endDate: string;
  config: MediaPlanConfigDto;
  campaignId?: string;
}

export interface ArtistData {
  name: string;
  country: string;
  imageUrl: string;
  youtubeFollowers: number;
  instagramFollowers: number;
  facebookFollowers: number;
  tiktokFollowers: number;
  spotifyListeners: number;
  genres: string[];
}

export interface VenueData {
  name: string;
  capacity: number;
  type: string;
  address: string;
}

export interface MediaPlanPerPhaseBudgetItem {
  phase: 'ON_SALE' | 'SUPPORT' | 'PUSH' | 'COUNTDOWN';
  percentage: number;
  budget: number;
  channel: 'Meta' | 'Google' | 'Tiktok' | 'Spotify' | 'OOH' | 'Geo' | 'Influencer' | 'Analog';
  days: number;
  spendPerDay: number;
  startDate: string;
  endDate: string;
}

export interface GroupSectionPerPhaseItem {
  digital: MediaPlanPerPhaseBudgetItem[];
  geo: MediaPlanPerPhaseBudgetItem[];
  influencer: MediaPlanPerPhaseBudgetItem[];
  ooh: MediaPlanPerPhaseBudgetItem[];
  analog: MediaPlanPerPhaseBudgetItem[];
}

export interface MediaPlanPerPhaseBudget {
  items: GroupSectionPerPhaseItem;
  budgetTotal: number;
  spendTotal: number;
}

export interface Phases {
  ON_SALE: MediaPlanPerPhaseBudget;
  SUPPORT: MediaPlanPerPhaseBudget;
  PUSH: MediaPlanPerPhaseBudget;
  COUNTDOWN: MediaPlanPerPhaseBudget;
}

export interface MediaPlanSummary {
  duration: number;
  metaBudget: number;
  googleBudget: number;
  tiktokBudget: number;
  spotifyBudget: number;
  digitalBudget: number;
  geoBudget: number;
  oohBudget: number;
  radioBudget: number;
  budget: number;
  startDate: string;
  endDate: string;
}

export interface CampaignConfiguration {
  digital: boolean;
  influencer: boolean;
  geo: boolean;
  analog: boolean;
  ooh: boolean;
}

export interface Campaign {
  id: string;
  artistId: string;
  venueId: string;
  artistData: ArtistData;
  venueData: VenueData;
  phases: Phases;
  summary: MediaPlanSummary;
  configuration: CampaignConfiguration;
  userId: string;
}

export interface CampaignResponse {
  campaign: Campaign;
}

// Artist Types
export interface Artist {
  id: number;
  name: string | null;
  image_url: string | null;
  isni: string | null;
  verified: boolean | null;
  sp_followers: number | null;
  sp_monthly_listeners: number | null;
  cm_artist_score: number | null;
}

export interface ArtistByIdResponse {
  artist: Artist;
}

export interface ArtistSearchResponse {
  artists: Artist[];
}

// Artist Stats Types
export interface TopCountry {
  name: string;
  code: string;
  percent: string;
  followers: number;
  subscribers?: number;
}

export interface TopCity {
  name: string;
  percent: string;
  followers: number;
  country: string;
  state?: string;
}

export interface LikersTopCountry {
  name: string;
  code: string;
  percent: string;
  likes: number;
}

export interface LikersTopCity {
  name: string;
  percent: string;
  likes: number;
  country: string;
  state?: string;
}

export interface AudienceGenderPerAge {
  code: string;
  male: string;
  female: string;
}

export interface AudienceEthnicity {
  code: string;
  name: string;
  weight: string;
}

export interface AudienceGender {
  code: string;
  weight: string;
}

export interface BrandAffinity {
  name: string;
  weight: string;
  affinity?: number;
}

export interface LikerInterest {
  name: string;
  weight: string;
  affinity: number;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeoCity {
  id: number;
  name: string;
  coords: Coordinates;
}

export interface GeoState {
  id: number;
  name: string;
  coords: Coordinates;
}

export interface GeoCountry {
  id: number;
  name: string;
  code: string;
  coords: Coordinates;
}

export interface Geo {
  city?: GeoCity;
  state?: GeoState;
  country?: GeoCountry;
}

export interface NotableFollower {
  user_id: string;
  username: string;
  picture: string;
  followers: number;
  fullname: string;
  url: string;
  geo?: Geo;
  is_verified: boolean;
  engagements: number;
}

export interface ArtistStatsData {
  top_countries: TopCountry[];
  top_cities: TopCity[];
  likers_top_countries: LikersTopCountry[];
  likers_top_cities: LikersTopCity[];
  audience_genders_per_age: AudienceGenderPerAge[];
  audience_ethnicities: AudienceEthnicity[];
  audience_genders: AudienceGender[];
  audience_brand_affinities: BrandAffinity[];
  audience_likers_interests: LikerInterest[];
  followers: number;
  avg_likes_per_post: number;
  avg_commments_per_post: number;
  engagement_rate: number;
  notable_followers: NotableFollower[];
  timestp: string;
}

// Zipcode Scoring Types
export interface ArtistEthnicityDto {
  code: string;
  name: string;
  weight: string;
}

export interface ScoreFiltersDto {
  nationality: boolean;
  ethnicity: boolean;
  sales: boolean;
  income: boolean;
  customerSpending: boolean;
}

export interface ScoreZipCodesDto {
  zipcodes: string[];
  artistId: string;
  artistTotalFollowers: number;
  ethnicity: ArtistEthnicityDto;
  artistCountryCode: string;
  scoreFilters: ScoreFiltersDto;
}

export interface ScoreZipCodesData {
  zipCode: number;
  totalScore: number;
  nationalityScore: number;
  predictSalesScore: number;
  customerSpendingScore: number;
  ethnicityScore: number;
  incomeScore: number;
  nationality: string;
  predictSales: number;
  income: number;
  customerSpending: number;
  population: number;
  artistTotalFollowers: number;
  artistFollowersEthnicity: string;
  artistFollowersEthnicityCount: number;
  artistFollowersBetterNationality: string;
  chartmetricArtistId: any;
  artistName: string;
}

// Event Discovery Types
export interface Image {
  ratio?: string;
  url?: string;
  width?: number;
  height?: number;
  fallback?: boolean;
}

export interface StartDate {
  datetime?: string;
  localDate?: string;
  localTime?: string;
}

export interface Dates {
  start?: StartDate;
  timezone?: string;
}

export interface Segment {
  id?: string;
  name?: string;
  levelType?: string;
}

export interface Genre {
  id?: string;
  name?: string;
  levelType?: string;
}

export interface SubGenre {
  id?: string;
  name?: string;
  levelType?: string;
}

export interface Classification {
  primary?: boolean;
  segment?: Segment;
  genre?: Genre;
  subGenre?: SubGenre;
}

export interface Promoter {
  id?: string;
  name?: string;
  description?: string;
}

export interface City {
  name?: string;
}

export interface State {
  name?: string;
  stateCode?: string;
}

export interface Country {
  name?: string;
  countryCode?: string;
}

export interface Address {
  line1?: string;
  line2?: string;
}

export interface Location {
  longitude?: string;
  latitude?: string;
}

export interface Venue {
  name?: string;
  type?: string;
  id?: string;
  locale?: string;
  city?: City;
  state?: State;
  country?: Country;
  address?: Address;
  location?: Location;
  images: Image[];
  distance?: number;
  units?: string;
  postalCode?: string;
  timezone?: string;
  url?: string;
}

export interface Event {
  id?: string;
  name?: string;
  type?: string;
  url?: string;
  locale?: string;
  images: Image[];
  dates?: Dates;
  classifications: Classification[];
  promoters: Promoter[];
  venues: Venue[];
}

export interface EventsDiscoverResponse {
  events: Event[];
}

// Google Places Types
export interface GooglePlaceAddressComponentDto {
  longText: string;
  shortText: string;
  types: string[];
  languageCode?: string;
}

export interface GooglePlacePlusCodeDto {
  globalCode: string;
  compoundCode?: string;
}

export interface GooglePlaceLocationDto {
  latitude: number;
  longitude: number;
}

export interface GooglePlaceViewportDto {
  low: GooglePlaceLocationDto;
  high: GooglePlaceLocationDto;
}

export interface GooglePlaceDateDto {
  year: number;
  month: number;
  day: number;
}

export interface GooglePlaceTimeDetailDto {
  day: number;
  hour: number;
  minute: number;
  date?: GooglePlaceDateDto;
  truncated?: boolean;
}

export interface GooglePlacePeriodDto {
  open: GooglePlaceTimeDetailDto;
  close?: GooglePlaceTimeDetailDto;
}

export interface GooglePlaceOpeningHoursDto {
  openNow: boolean;
  periods: GooglePlacePeriodDto[];
  weekdayDescriptions: string[];
  nextOpenTime?: string;
}

export interface GooglePlaceDisplayNameDto {
  text: string;
  languageCode?: string;
}

export interface GooglePlaceAuthorAttributionDto {
  displayName: string;
  uri: string;
  photoUri?: string;
}

export interface GooglePlaceReviewDto {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text: GooglePlaceDisplayNameDto;
  originalText?: GooglePlaceDisplayNameDto;
  authorAttribution: GooglePlaceAuthorAttributionDto;
  publishTime: string;
  flagContentUri: string;
  googleMapsUri: string;
}

export interface GooglePlaceAccessibilityOptionsDto {
  wheelchairAccessibleParking?: boolean;
  wheelchairAccessibleEntrance?: boolean;
  wheelchairAccessibleRestroom?: boolean;
}

export interface GooglePlaceLandmarkDto {
  name: string;
  placeId: string;
  displayName: GooglePlaceDisplayNameDto;
  types: string[];
  spatialRelationship?: string;
  straightLineDistanceMeters: number;
  travelDistanceMeters?: number;
}

export interface GooglePlaceAddressDescriptorDto {
  landmarks?: GooglePlaceLandmarkDto[];
}

export interface GooglePlaceGoogleMapsLinksDto {
  directionsUri: string;
  placeUri: string;
  writeAReviewUri: string;
  reviewsUri: string;
  photosUri: string;
}

export interface GooglePlaceTimeZoneDto {
  id: string;
}

export interface GooglePlaceDto {
  name: string;
  id: string;
  types: string[];
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  formattedAddress: string;
  addressComponents: GooglePlaceAddressComponentDto[];
  plusCode: GooglePlacePlusCodeDto;
  location: GooglePlaceLocationDto;
  viewport: GooglePlaceViewportDto;
  rating?: number;
  googleMapsUri: string;
  regularOpeningHours: GooglePlaceOpeningHoursDto;
  utcOffsetMinutes: number;
  adrFormatAddress?: string;
  businessStatus?: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY';
  userRatingCount?: number;
  iconMaskBaseUri?: string;
  iconBackgroundColor?: string;
  displayName: GooglePlaceDisplayNameDto;
  primaryTypeDisplayName?: GooglePlaceDisplayNameDto;
  dineIn?: boolean;
  currentOpeningHours?: GooglePlaceOpeningHoursDto;
  primaryType?: string;
  shortFormattedAddress?: string;
  reviews?: GooglePlaceReviewDto[];
  restroom?: boolean;
  goodForGroups?: boolean;
  accessibilityOptions?: GooglePlaceAccessibilityOptionsDto;
  addressDescriptor?: GooglePlaceAddressDescriptorDto;
  googleMapsLinks?: GooglePlaceGoogleMapsLinksDto;
  timeZone?: GooglePlaceTimeZoneDto;
}

// Artist Metadata Types
export interface GenreOrSubgenre {
  id?: number;
  name?: string;
  link_type?: string;
  score?: number;
}

export interface Genres {
  primary: GenreOrSubgenre;
  secondary: GenreOrSubgenre[];
  sub: GenreOrSubgenre[];
}

export interface CareerStatus {
  stage?: string;
  stage_score?: number;
  trend?: string;
  trend_score?: number;
}

export interface LocationListenersStats {
  code2?: string;
  listeners?: number;
  name?: string;
}

export interface CmStatistics {
  sp_where_people_listen: LocationListenersStats[];
  most_popular_country?: string;
  sp_followers?: number;
  deezer_fans?: number;
  sp_popularity?: number;
  sp_monthly_listeners?: number;
  ycs_subscribers?: number;
  ycs_views?: number;
  tiktok_followers?: number;
  tiktok_likes?: number;
  tiktok_top_video_views?: number;
  tiktok_track_posts?: number;
  line_music_artist_likes?: number;
  line_music_likes?: number;
  line_music_plays?: number;
  line_music_mv_plays?: number;
  melon_artist_fans?: number;
  melon_likes?: number;
  melon_video_likes?: number;
  melon_video_views?: number;
  youtube_daily_video_views?: number;
  youtube_monthly_video_views?: number;
  twitch_followers?: number;
  twitch_views?: number;
  twitch_monthly_viewer_hours?: number;
  twitch_weekly_viewer_hours?: number;
  pandora_listeners_28_day?: number;
  pandora_lifetime_stations_added?: number;
  pandora_lifetime_streams?: number;
  boomplay_ranking_current?: number;
  boomplay_favorites?: number;
  boomplay_shares?: number;
  boomplay_comments?: number;
  boomplay_plays?: number;
  num_sp_editorial_playlists?: number;
  num_sp_playlists?: number;
  sp_playlist_total_reach?: number;
  sp_editorial_playlist_total_reach?: number;
  num_am_editorial_playlists?: number;
  num_am_playlists?: number;
  num_de_editorial_playlists?: number;
  num_de_playlists?: number;
  de_playlist_total_reach?: number;
  de_editorial_playlist_total_reach?: number;
  num_az_editorial_playlists?: number;
  num_az_playlists?: number;
  num_yt_editorial_playlists?: number;
  num_yt_playlists?: number;
  yt_playlist_total_reach?: number;
  yt_editorial_playlist_total_reach?: number;
  shazam_count?: number;
  genius_pageviews?: number;
  sp_popularity_rank?: number;
  deezer_fans_rank?: number;
  sp_followers_rank?: number;
  sp_monthly_listeners_rank?: number;
  ins_followers_rank?: number;
  ycs_subscribers_rank?: number;
  ycs_views_rank?: number;
  tiktok_followers_rank?: number;
  tiktok_track_posts_rank?: number;
  tiktok_likes_rank?: number;
  tiktok_top_video_views_rank?: number;
  line_music_artist_likes_rank?: number;
  line_music_likes_rank?: number;
  line_music_plays_rank?: number;
  line_music_mv_plays_rank?: number;
  melon_artist_fans_rank?: number;
  melon_likes_rank?: number;
  melon_video_likes_rank?: number;
  melon_video_views_rank?: number;
  youtube_daily_video_views_rank?: number;
  youtube_monthly_video_views_rank?: number;
  twitch_followers_rank?: number;
  twitch_views_rank?: number;
  twitch_monthly_viewer_hours_rank?: number;
  twitch_weekly_viewer_hours_rank?: number;
  pandora_listeners_28_day_rank?: number;
  pandora_lifetime_stations_added_rank?: number;
  pandora_lifetime_streams_rank?: number;
  boomplay_ranking_current_rank?: number;
  boomplay_favorites_rank?: number;
  boomplay_shares_rank?: number;
  boomplay_comments_rank?: number;
  boomplay_plays_rank?: number;
  cm_artist_rank?: number;
  cm_artist_rank_percentile?: number;
  fan_base_rank?: number;
  fan_base_rank_percentile?: number;
  engagement_rank?: number;
  engagement_rank_percentile?: number;
  artist_score?: number;
  facebook_followers?: number;
  ins_followers?: number;
}

export interface ArtistMetadata {
  id?: number;
  name?: string;
  gender_title?: string;
  hometown_city?: string;
  country?: string;
  image_url?: string;
  timestamp?: string;
  description?: string;
  cm_artist_rank?: number;
  genres: Genres;
  career_status: CareerStatus;
  cm_statistics: CmStatistics;
}

// Billboard Types
export interface GenericFilterDto {
  field: string;
  value: string | number | boolean | null;
  operator: 'Eq' | 'NotEq' | 'Gt' | 'Gte' | 'Lt' | 'Lte' | 'Like';
}

export interface GenericFilterGroupDto {
  name: string;
  filters: GenericFilterDto[];
  operator?: 'And' | 'Or';
}

export interface GenericSortingDto {
  field: string;
  desc: boolean;
}

export interface QueryBillboardsRequestBodyDto {
  filterGroups?: GenericFilterGroupDto[];
  sorting?: GenericSortingDto;
  page?: number;
  pageSize?: number;
}

export type BillboardUnitType = 
  | 'Airport' | 'Alternative' | 'Billboard' | 'Retail/Venues' 
  | 'Street Furniture' | 'Transit' | 'Wallscape' | 'Wildposting' | 'Windowscape';

export type BillboardScreenType = 'Static' | 'Digital';

export type BillboardOrientation = 'CR' | 'LHR' | 'RHR';

export type BillboardAttribution = 'Has attribution' | 'No attribution' | 'Unknown';

export interface ZipCodeDto {
  id?: string;
  code: string;
  countyId: string;
  cityId: string;
}

export interface BillboardDto {
  id?: string;
  name?: string;
  size?: string;
  unitType?: BillboardUnitType;
  screenType?: BillboardScreenType;
  illuminated?: boolean;
  faceId?: string;
  orientation?: BillboardOrientation;
  attribution?: BillboardAttribution;
  zipCode: ZipCodeDto;
}

export interface QueryBillboardsResponseContentDto {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: BillboardDto[];
}

export interface QueryRatedZipCodeListBillboardCountRequestBodyDto {
  zipCodeFilterList?: GenericFilterDto[];
}

export interface RatedZipCodeBillboardCountDto {
  zipCode: string;
  count: number;
}

export interface QueryRatedZipCodeListBillboardCountResponseContentDto {
  items: RatedZipCodeBillboardCountDto[];
}

// Analog Radio Types
export interface QueryAnalogRadioRequestBodyDto {
  filterGroups?: GenericFilterGroupDto[];
  sorting?: GenericSortingDto;
  page?: number;
  pageSize?: number;
}

export type AnalogRadioFormat = 
  | 'Contemporary Christian' | 'Gospel' | 'Religious' | 'Christian Adult Contemporary'
  | 'Southern Gospel' | 'Contemporary Inspirational' | 'Spanish Religious'
  | 'Pop Contemporary Hit Radio' | 'Adult Contemporary' | 'Other' | 'World Ethnic'
  | 'Variety' | 'Adult Standards/MOR' | 'Spanish Variety' | 'Latino Urban'
  | 'Spanish Contemporary' | 'Spanish Tropical' | 'Adult Hits' | 'Country'
  | 'Spanish Contemporary Christian' | 'Hot Adult Contemporary' | 'Modern Adult Contemporary'
  | 'Soft Adult Contemporary' | 'Urban Contemporary' | 'Rhythmic Contemporary Hit Radio'
  | 'Classic Rock' | 'Album Oriented Rock' | 'Active Rock' | 'Mainstream Rock'
  | 'Rhythmic AC' | 'Classical' | 'Alternative' | 'Album Adult Alternative'
  | 'Urban Adult Contemporary' | 'Rhythmic Oldies' | 'Urban Oldies' | 'Jazz'
  | 'New AC (NAC)/Smooth Jazz' | 'New Country' | 'Classic Country' | 'Blues'
  | 'Easy Listening' | 'Holiday Music' | 'Oldies' | 'Nostalgia' | '80\'s Hits'
  | 'Classic Hits' | 'Talk/Personality' | 'Spanish Adult Hits'
  | 'Spanish Hot Adult Contemporary' | 'Mexican Regional' | 'Tejano'
  | 'Spanish Oldies' | 'Educational';

export interface AnalogRadioRatingDto {
  month: string;
  rating: string;
}

export interface AnalogRadioDto {
  id?: string;
  market: string;
  callSign: string;
  city: string;
  state: string;
  format: AnalogRadioFormat;
  ratings: AnalogRadioRatingDto[];
}

export interface QueryAnalogRadioResponseContentDto {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: AnalogRadioDto[];
}

// Payment Types
export interface CreateStripePaymentDto {
  description: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
  email: string;
  quantity: number;
}

export interface StripePaymentSessionResponse {
  url: string;
  sessionId: string;
}

// Activity Types
export interface QuerySessionsRequestBodyDto {
  sessionStartFilter?: GenericFilterDto;
  sessionEndFilter?: GenericFilterDto;
  userNameFilter?: GenericFilterDto;
  userEmailFilter?: GenericFilterDto;
  userIdFilter?: GenericFilterDto;
  mediaPlanGeneratedCountFilter?: GenericFilterDto;
  includeActions?: boolean;
  sorting?: GenericSortingDto;
  page?: number;
  pageSize?: number;
}

export interface ActionMetadataDto {
  mediaPlanGeneratedCount: number;
}

export interface OriginMetadataDto {
  ip: string;
  userAgent: string;
  referer: string;
  origin: string;
}

export interface RoleDto {
  id?: string;
  name: string;
  displayName: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  avatar: string;
  role: RoleDto;
  credits: number;
  phone: string;
  location: string;
  company: string;
  market: string;
  industryRole: string;
  isOnboardingComplete: boolean;
}

export interface SessionDto {
  id?: string;
  active: boolean;
  activatedAt: number;
  deactivatedAt: number;
  actionMetadata: ActionMetadataDto;
  originMetadata: OriginMetadataDto;
  systemUserAuth: UserDto;
}

export type ActivityActionType = 
  | 'session_start' | 'session_end' | 'media_plan_generated'
  | 'user_created' | 'user_updated' | 'user_deleted';

export type ActivitySectionType = 'auth' | 'admin' | 'media_plan';

export interface ActionDto {
  id?: string;
  type: ActivityActionType;
  section: ActivitySectionType;
  properties?: Record<string, any>;
}

export interface SessionWithActionsDto extends SessionDto {
  actions: ActionDto[];
}

export interface QuerySessionsResponseContentDto {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: SessionDto[] | SessionWithActionsDto[];
}

export interface CreateSessionRequestBodyDto {
  authUserId: string;
  activatedAt: number;
}

export interface CreateSessionResponseContentDto {
  session: SessionDto;
}

export interface DeactivateSessionRequestBodyDto {
  sessionId: string;
  deactivatedAt: number;
}

export interface DeactivateSessionResponseContentDto {
  sessionId: string;
}

export interface QueryActionsRequestBodyDto {
  sessionIdFilter?: GenericFilterDto;
  typeFilter?: GenericFilterDto;
  sectionFilter?: GenericFilterDto;
  page?: number;
  pageSize?: number;
}

export interface QueryActionsResponseContentDto {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: ActionDto[];
}

export interface CreateActionRequestBodyDto {
  id?: string;
  type: ActivityActionType;
  section: ActivitySectionType;
  properties?: Record<string, any>;
  sessionId: string;
}

export interface CreateActionResponseContentDto {
  action: ActionDto;
}

// Dashboard Types
export interface DashboardAverageTicketPriceDto {
  id?: string;
  averagePrice: number;
  month: number;
  year: number;
}

export interface QueryDashboardAverageTicketPriceResponseContentDto {
  items: DashboardAverageTicketPriceDto[];
}

export interface DashboardPromoterDto {
  id?: string;
  eventCount: number;
  promoter: string;
  month: number;
  year: number;
}

export interface QueryDashboardPromoterResponseContentDto {
  items: DashboardPromoterDto[];
}

export interface DashboardTopCitiesDto {
  totalEventCount: number;
  city: string;
  percentage: number;
}

export interface QueryDashboardTopCitiesResponseContentDto {
  items: DashboardTopCitiesDto[];
}

export interface DashboardTopGenresDto {
  totalEventCount: number;
  genre: string;
  percentage: number;
}

export interface QueryDashboardTopGenresResponseContentDto {
  items: DashboardTopGenresDto[];
}

export interface QueryDashboardGrossRevenueResponseContentDto {
  totalGrossRevenue: number;
}

export interface DashboardTrafficShowsDto {
  id?: string;
  seatsCount: number;
  month: number;
  year: number;
}

export interface QueryDashboardTrafficShowsResponseContentDto {
  items: DashboardTrafficShowsDto[];
}

// Campaign Types
export interface CreateCampaignDto {
  artistId: string;
  venueId: string;
  phases: Phases;
  summary: MediaPlanSummary;
  configuration: CampaignConfiguration;
  userId: string;
}

export interface ListResponse {
  total: number;
  page: number;
  limit: number;
}

export interface UpdateCampaignDto {
  artistId?: string;
  venueId?: string;
  phases?: Phases;
  summary?: MediaPlanSummary;
  configuration?: CampaignConfiguration;
  userId?: string;
}

// Auth Types
export interface UserVerificationResponse {
  verified: boolean;
} 