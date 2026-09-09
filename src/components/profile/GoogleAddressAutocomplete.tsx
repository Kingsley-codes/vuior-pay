"use client";

import { useEffect, useRef } from "react";

type PlaceResult = {
  formatted_address?: string;
  address_components?: {
    long_name: string;
    types: string[];
  }[];
};

export type SelectedAddress = { address: string; zipCode: string };

type MapsListener = { remove: () => void };
type PlacesAutocomplete = {
  addListener: (
    eventName: "place_changed",
    handler: () => void,
  ) => MapsListener;
  getPlace: () => PlaceResult;
};

type PlacesLibrary = {
  Autocomplete: new (
    input: HTMLInputElement,
    options: {
      fields: string[];
      types: string[];
    },
  ) => PlacesAutocomplete;
};

type GoogleMapsWindow = Window &
  typeof globalThis & {
    google?: { maps?: { places?: PlacesLibrary } };
    __vuiorGoogleMapsReady?: () => void;
  };

let googleMapsPromise: Promise<PlacesLibrary> | null = null;

function loadPlacesLibrary(apiKey: string) {
  const mapsWindow = window as GoogleMapsWindow;
  const loadedLibrary = mapsWindow.google?.maps?.places;
  if (loadedLibrary) return Promise.resolve(loadedLibrary);
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise<PlacesLibrary>((resolve, reject) => {
    const callbackName = "__vuiorGoogleMapsReady";
    const scriptId = "vuior-google-maps";

    mapsWindow[callbackName] = () => {
      const library = mapsWindow.google?.maps?.places;
      if (!library) {
        googleMapsPromise = null;
        reject(new Error("Google Places loaded without the Places library."));
        return;
      }
      resolve(library);
    };

    const existingScript = document.getElementById(scriptId);
    if (existingScript) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&libraries=places&callback=${callbackName}`;
    script.onerror = () => {
      googleMapsPromise = null;
      reject(new Error("Google Maps could not be loaded."));
    };
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

export default function GoogleAddressAutocomplete({
  value,
  onChange,
  onAddressSelected,
}: {
  value: string;
  onChange: (value: string) => void;
  onAddressSelected: (address: SelectedAddress) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectionHandlerRef = useRef(onAddressSelected);

  useEffect(() => {
    selectionHandlerRef.current = onAddressSelected;
  }, [onAddressSelected]);

  useEffect(() => {
    const input = inputRef.current;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!input || !apiKey) return;

    let listener: MapsListener | undefined;
    let disposed = false;

    loadPlacesLibrary(apiKey)
      .then(({ Autocomplete }) => {
        if (disposed) return;
        const autocomplete = new Autocomplete(input, {
          fields: ["formatted_address", "address_components"],
          types: ["address"],
        });

        listener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const formattedAddress = place.formatted_address?.trim();
          if (!formattedAddress) return;
          const zipCode =
            place.address_components?.find((component) =>
              component.types.includes("postal_code"),
            )?.long_name || "";
          selectionHandlerRef.current({ address: formattedAddress, zipCode });
        });
      })
      .catch((error: unknown) => {
        // The field remains a normal editable input if Google is unavailable.
        console.error(error);
      });

    return () => {
      disposed = true;
      listener?.remove();
    };
  }, []);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Start typing your street address"
      autoComplete="off"
      required
    />
  );
}
