import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

function GooglePlaces(props) {
    const [value, setValue] = useState(null);

    useEffect(() => {
        console.log('value', value);
        props.change(value && value.label || null);
    }, [value])

    useEffect(() => {
        if (props.value) {
            setValue({ label: props.value, value: {} })
        }
    }, [props.value])
    return (
        <div>
            <GooglePlacesAutocomplete
                selectProps={{
                    value,
                    onChange: setValue,
                    placeholder: props.placeholder || "Select",
                }}
                apiOptions={{ types: ['(cities)'] }}
                autocompletionRequest={{
                    types: ['(cities)'],
                }}
            />
        </div>
    )
}
export default GooglePlaces;