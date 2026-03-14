# Create the PRD markdown content and export it as a .md file using pypandoc as required

import pypandoc

content = """
# FlatMe – Product Requirements Document (PRD)

## Product Vision
FlatMe helps people living in large cities quickly find **flats, flatmates, local services, second-hand equipment, and nearby events** in one place.

Initial target cities:
- Hyderabad
- Kolkata
- Delhi
- Mumbai
- Pune
- Gurgoun


Future expansion: Tier-1 and Tier-2 cities.

---

# Core Modules

1. Flats Listing
2. Flatmate Finder
3. Maid / Local Services
4. Equipment Marketplace
5. Nearby Events
6. Global Search

Authentication intentionally excluded.

---

# 1. Flats Listing Module

## Description
Users can browse and post flats available for rent or sharing.

## Data Fields

- listingId
- city
- locality
- rent
- deposit
- flatType (1BHK, 2BHK, 3BHK, Shared)
- furnishing (Furnished / Semi / Unfurnished)
- genderPreference
- photos
- description
- amenities
- postedDate
- contactPhone

## Acceptance Criteria

### AC1: View Flats by City
Given user opens homepage  
When user selects a city  
Then system displays flats available in that city.

### AC2: View Flat Details
Given user clicks a flat card  
When details page loads  
Then system shows rent, deposit, images, amenities, gender preference, location, and contact number.

### AC3: Filter Flats
Given flats page is open  
When user applies filters (rent range, flat type, furnishing, gender preference)  
Then system returns filtered results.

### AC4: Post Flat Listing
Given user fills listing form  
When form is submitted  
Then system stores flat listing and displays it in search results.

---

# 2. Flatmate Finder Module

## Description
Users can find people looking for shared accommodation.

## Data Fields

- userName
- age
- gender
- profession
- preferredCity
- preferredLocality
- rentBudget
- moveInDate
- smokingPreference
- foodPreference
- contactPhone

## Acceptance Criteria

### AC1: Browse Flatmates
Given user opens flatmate section  
When city is selected  
Then system displays flatmates in that city.

### AC2: Gender Preference Filter
Given flatmate list is displayed  
When user selects Male/Female filter  
Then system displays matching profiles.

### AC3: View Flatmate Profile
Given user clicks a profile  
When profile page opens  
Then system displays age, profession, preferences, budget, and contact info.

### AC4: Post Flatmate Requirement
Given user submits flatmate form  
When form validation passes  
Then profile becomes searchable.

---

# 3. Maid / Local Services Module

## Description
Users can find housemaids and helpers nearby.

## Supported Services

- Maid
- Cook
- Cleaning
- Laundry helper
- Babysitter

## Data Fields

- serviceId
- serviceType
- name
- location
- experience
- availableTime
- monthlyCharge
- contactNumber

## Acceptance Criteria

### AC1: View Services
Given user opens services page  
When city and locality selected  
Then system lists available helpers.

### AC2: Filter by Service Type
Given services list is shown  
When user selects Maid/Cook/Cleaner  
Then system filters results.

### AC3: Contact Service
Given service profile page  
When user clicks contact  
Then phone number is displayed.

---

# 4. Equipment Marketplace

## Description
Users can sell or buy second-hand items.

## Typical Equipment

- Bed
- Table
- Chair
- Refrigerator
- Washing Machine
- Kitchen items

## Data Fields

- itemId
- itemName
- category
- price
- condition
- photos
- sellerContact
- location

## Acceptance Criteria

### AC1: View Equipment
Given marketplace page  
When city selected  
Then system lists available items.

### AC2: Filter Equipment
Filters include category, price range, and condition.

### AC3: Item Details
Given user opens item page  
Then system shows images, price, condition, and seller contact.

### AC4: Post Equipment Listing
Given seller submits item form  
Then item appears in marketplace.

---

# 5. Nearby Events Module

## Description
Shows local events happening in the city.

## Event Types

- Meetups
- Tech talks
- Cultural events
- Music shows
- Sports activities

## Data Fields

- eventId
- eventName
- category
- date
- venue
- city
- description
- organizer
- eventLink

## Acceptance Criteria

### AC1: View Events
Given events page loads  
When city selected  
Then upcoming events are displayed.

### AC2: Event Details
Given user clicks event  
Then page shows event name, venue, date, description, and organizer.

### AC3: Event Category Filter
Categories include Tech, Music, Networking, Sports, and Community.

---

# 6. Global Search

## Description
Search across all modules.

## Acceptance Criteria

### AC1: Keyword Search
Given user enters keyword  
When search executed  
Then results show from flats, flatmates, equipment, services, and events.

### AC2: Location Search
Given location entered  
Then system prioritizes results in that area.

---

# 7. Homepage Layout

Sections:

1. City Selector
2. Featured Flats
3. Find Flatmates
4. Local Services
5. Equipment Marketplace
6. Upcoming Events

## Acceptance Criteria

### AC1: Homepage Load
Given user visits site  
Then homepage loads within 2 seconds.

### AC2: City Personalization
Given user selects city  
Then homepage content updates accordingly.

---

# Non-Functional Requirements

Performance:
- Page load < 2 seconds
- Search response < 500ms

Scalability:
- Support 100K listings per city

SEO:
- City pages must be indexable.

---

# Suggested Database Tables

- cities
- flats
- flatmates
- services
- equipment_items
- events
- listings_images

---

# Future Features (V2)

- Flat booking 
- In-app chat
- Reviews
- Payments
- Verified listings
- AI flatmate matching
"""

