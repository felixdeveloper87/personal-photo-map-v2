import React, { useEffect, useContext, useCallback, useState } from 'react';
import { MapContainer, GeoJSON, Rectangle } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import countriesData from '../map/countries.json';
import { AuthContext } from '../context/AuthContext';
import { CountriesContext } from '../context/CountriesContext';
import { Box } from '@chakra-ui/react';

/**
 * Map Component:
 * This component displays an interactive world map using react-leaflet.
 * It highlights countries based on user interaction and their photo status.
 */
const Map = () => {
  // Setup navigation for routing to country details on click
  const navigate = useNavigate();

  // Context to check if user is authenticated
  const { isLoggedIn } = useContext(AuthContext);
  const { countriesWithPhotos, loading } = useContext(CountriesContext);

  // State to store countries with photos, highlighted countries, and effect activity
  // const [countriesWithPhotos, setCountriesWithPhotos] = useState([]);
  const [highlightedCountries, setHighlightedCountries] = useState([]);
  const [isEffectActive, setIsEffectActive] = useState(!isLoggedIn);

  
  useEffect(() => {
    setIsEffectActive(!isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    let interval;

    if (isEffectActive && !isLoggedIn) {
      interval = setInterval(() => {
        const selectRandomCountries = (numCountries) => {
          const allCountries = countriesData.features.map(
            (country) => country.properties.iso_a2.toLowerCase()
          );

          const maxCountries = Math.min(numCountries, allCountries.length);
          const shuffled = allCountries.sort(() => 0.5 - Math.random());
          return shuffled.slice(0, maxCountries);
        };

        const randomCountries = selectRandomCountries(15);
        setHighlightedCountries(randomCountries);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isEffectActive, isLoggedIn]);


  const countryStyle = useCallback(
    (feature) => {
      const countryId = feature.properties.iso_a2.toLowerCase();
      const hasPhotos = countriesWithPhotos.some((country) => country.id === countryId);
      const isHighlighted = highlightedCountries.includes(countryId);

      if (!isLoggedIn && isEffectActive && isHighlighted) {
        return {
          fillColor: '#2ecc71',
          weight: 2,
          color: '#1B4F72',
          fillOpacity: 0.9,
          transition: 'fill-opacity 0.5s ease, fill-color 0.5s ease',
        };
      }

      if (isLoggedIn && hasPhotos) {
        return {
          fillColor: '#2ecc71',
          weight: 2,
          color: '#1B4F72',
          fillOpacity: 1,
          transition: 'fill-opacity 0.5s ease, fill-color 0.5s ease',
        };
      }

      return {
        fillColor: '#D4E6F1',
        weight: 2,
        color: '#1B4F72',
        fillOpacity: 1,
        transition: 'fill-opacity 0.5s ease, fill-color 0.5s ease',
      };
    },
    [countriesWithPhotos, highlightedCountries, isLoggedIn, isEffectActive]
  );

  /**
   * Function to handle interactions with each country:
   * - Adds hover effect to change fill color.
   * - Redirects to the country detail page on click.
   */
  const onEachCountry = useCallback(
    (country, layer) => {
      layer.on({
        mouseover: (e) => {
          e.target.setStyle({
            fillColor: '#3498DB',
            weight: 2,
            color: '#1B4F72',
            fillOpacity: 0.7,
          });
        },
        mouseout: (e) => {
          e.target.setStyle(countryStyle(country));
        },
        click: () => {
          const countryId = country.properties.iso_a2.toLowerCase();
          navigate(`/countries/${countryId}`);
        },
      });
    },
    [navigate, countryStyle]
  );

  // Bounding box for the map to restrict panning to the world area
  const bounds = [
    [-85, -180],
    [85, 180],
  ];

  /**
   * Re-renders the GeoJSON component when countriesWithPhotos changes
   * by incrementing the geoJsonKey to force a fresh render.
   */
  const [geoJsonKey, setGeoJsonKey] = useState(0);

  useEffect(() => {
    setGeoJsonKey((prevKey) => prevKey + 1);
  }, [countriesWithPhotos]);

  // Bounding box for ocean background fill
  const oceanBounds = [
    [-90, -180],
    [90, 180],
  ];

  return (
    <Box mt="-20px">
      <MapContainer
        center={[20, 0]} // Initial map center position
        zoom={2.6}        // Initial zoom level
        minZoom={2.3}     // Prevent zooming out too far
        maxZoom={7.5}     // Maximum zoom level allowed
        maxBounds={bounds} // Restrict map bounds to prevent excessive panning
        maxBoundsViscosity={1.0} // Bound "stickiness" at edges
        worldCopyJump={false} // Prevents map duplication when panning
        style={{ height: '1000px', width: '100%' }}
      >
        {/* Rectangle to add ocean background color */}
        <Rectangle
          bounds={oceanBounds}
          pathOptions={{
            fillColor: '#B3E5FC', // Ocean color fill
            fillOpacity: 1,
            stroke: false,
          }}
        />
        <GeoJSON
          key={geoJsonKey} // Unique key to force re-render on data change
          data={countriesData} // GeoJSON data for countries
          style={countryStyle} // Style function for country fill and borders
          onEachFeature={onEachCountry} // Interaction handling function
        />
      </MapContainer>
    </Box>
  );
};

export default Map;
