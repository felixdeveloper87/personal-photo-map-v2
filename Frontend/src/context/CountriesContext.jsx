import React, { createContext, useState, useEffect } from 'react';
import countries from 'i18n-iso-countries';

// Create and export the context to provide global state access for countries-related data
export const CountriesContext = createContext();

/**
 * CountriesProvider Component
 * This component acts as a context provider for countries-related data, including:
 * - Countries with photos
 * - Loading state
 * - Photo and country counts
 * It wraps child components and exposes the above data through the context API.
 */
export const CountriesProvider = ({ children }) => {
    // State for storing countries that have associated photos
    const [countriesWithPhotos, setCountriesWithPhotos] = useState([]);
    // State for tracking whether data is still loading
    const [loading, setLoading] = useState(true);
    // State for the total number of photos uploaded
    const [photoCount, setPhotoCount] = useState(0);
    // State for the total number of countries with photos
    const [countryCount, setCountryCount] = useState(0);

    /**
     * fetchCounts - Fetches the total photo count and country count from the backend API
     * This function retrieves aggregated metrics and updates the respective state variables.
     */
    const fetchCounts = async () => {
        const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage
        console.log('Token:', token); // Log the token for debugging purposes

        if (!token) return; // Exit early if the token does not exist

        try {
            // API call to fetch photo and country counts
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/count`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token for authentication
                },
            });

            // If the response is not successful, throw an error
            if (!response.ok) {
                throw new Error('Error fetching photo and country counts');
            }

            const data = await response.json(); // Parse the response JSON
            setPhotoCount(data.photoCount); // Update the photo count state
            setCountryCount(data.countryCount); // Update the country count state
        } catch (error) {
            // Handle API errors by logging and resetting counts
            console.error('Error fetching photo/country counts:', error);
            setPhotoCount(0);
            setCountryCount(0);
        }
    };

    /**
     * fetchCountriesWithPhotos - Fetches a list of countries with associated photos from the backend API
     * This function retrieves a list of country IDs and maps them to their corresponding names.
     */
    const fetchCountriesWithPhotos = async () => {
        const token = localStorage.getItem('token'); // Retrieve the JWT token

        if (!token) {
            // If no token exists, reset state and exit
            setCountriesWithPhotos([]);
            setLoading(false);
            return;
        }

        try {
            // API call to fetch the list of countries with photos
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/countries-with-photos`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token for authentication
                },
            });

            // If the response is not successful, throw an error
            if (!response.ok) {
                throw new Error('Error fetching countries with photos');
            }

            const data = await response.json(); // Parse the response JSON
            // Map the country IDs to their names using the i18n-iso-countries library
            const mappedCountries = data.map((id) => ({
                id,
                name: countries.getName(id.toUpperCase(), 'en') || id, // Fallback to the ID if the name is unavailable
            }));
            setCountriesWithPhotos(mappedCountries); // Update the state with the mapped data
        } catch (error) {
            // Handle API errors by logging and resetting the state
            console.error('Error fetching countries with photos:', error);
            setCountriesWithPhotos([]);
        } finally {
            // Ensure the loading state is reset regardless of success or failure
            setLoading(false);
        }
    };

    /**
     * refreshCountriesWithPhotos - Refreshes both the counts and the countries with photos
     * This function ensures all relevant data is fetched and updated simultaneously.
     */
    const refreshCountriesWithPhotos = async () => {
        setLoading(true); // Set the loading state to true while data is being fetched
        await Promise.all([fetchCounts(), fetchCountriesWithPhotos()]); // Execute both fetch operations in parallel
    };

    /**
     * useEffect - Effect for monitoring token changes and triggering data refresh
     * This effect listens for changes in the localStorage token (via the 'storage' event)
     * and updates the context state accordingly.
     */
    useEffect(() => {
        const updateData = () => {
            const token = localStorage.getItem('token'); // Retrieve the current token
            if (token) {
                refreshCountriesWithPhotos(); // Fetch data if the token exists
            } else {
                // Reset the state if the token is absent
                setPhotoCount(0);
                setCountryCount(0);
                setCountriesWithPhotos([]);
            }
        };

        // Listen for 'storage' events to detect token changes across tabs/windows
        window.addEventListener('storage', updateData);
        updateData(); // Perform an initial data fetch on component mount

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('storage', updateData);
        };
    }, []);

    return (
        // Provide the context value to child components
        <CountriesContext.Provider
            value={{
                countriesWithPhotos,
                loading,
                photoCount,
                countryCount,
                refreshCountriesWithPhotos,
            }}
        >
            {children} {/* Render all child components passed to this provider */}
        </CountriesContext.Provider>
    );
};
