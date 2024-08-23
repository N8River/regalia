// import React, { useState } from 'react';
// import ReactSlider from 'react-slider';

// function PriceRangeSlider() {
//     const [priceRange, setPriceRange] = useState([100, 500]);

//     return (
//         <div>
//             <ReactSlider
//                 className="horizontal-slider"
//                 thumbClassName="example-thumb"
//                 trackClassName="example-track"
//                 defaultValue={[100, 500]}
//                 ariaLabel={['Lower thumb', 'Upper thumb']}
//                 ariaValuetext={state => `Thumb value ${state.valueNow}`}
//                 renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
//                 pearling
//                 minDistance={10}
//                 min={0}
//                 max={1000}
//                 step={10}
//                 onChange={(value) => setPriceRange(value)}
//             />
//             <div>
//                 Min Price: ${priceRange[0]}
//                 <br />
//                 Max Price: ${priceRange[1]}
//             </div>
//         </div>
//     );
// }

// export default PriceRangeSlider;
