import { COLORS } from '../../reusable';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const Logo = ({ size }) => {
  const logoTitle = 'University of Michigan Library';
  // Original logo size: 34px x 224px (17:112 ratio)
  const getWidth = Math.round((size * 112) / 17);
  const color = COLORS.blue['400'];
  return (
    <div
      css={{
        lineHeight: '0'
      }}
    >
      <Link to='/'>
        <svg
          viewBox='0 0 199 30'
          focusable='false'
          aria-label={logoTitle}
          css={{
            height: `${size}px`,
            maxWidth: '100%',
            width: `${getWidth}px`
          }}
          role='img'
        >
          <title>{logoTitle}</title>
          <g fill='none' fillRule='evenodd'>
            <g fillRule='nonzero'>
              <polyline fill={COLORS.maize['400']} points='20.9572917 24.7441667 12.3733333 13.0122917 12.3733333 21.5458333 15.7866667 21.5458333 15.7866667 29.973125 0 29.973125 0 21.5458333 3.19875 21.5458333 3.19875 8.425625 0 8.425625 0 0 12.4010417 0 20.9572917 11.8164583 29.5135417 0 41.9116667 0 41.9116667 8.425625 38.7110417 8.425625 38.7110417 21.5458333 41.9116667 21.5458333 41.9116667 29.973125 26.1270833 29.973125 26.1270833 21.5458333 29.5377083 21.5458333 29.5377083 13.0122917 20.9572917 24.7441667'></polyline>
              <polyline fill={color} points='58.6452083 30 58.6452083 0.0420833333 62.461875 0.0420833333 62.461875 26.680625 73.4579167 26.680625 73.4579167 30 58.6452083 30'></polyline>
              <polygon fill={color} points='77.9570833 29.9875 81.773125 29.9875 81.773125 0.0420833333 77.9570833 0.0420833333'></polygon>
              <path d='M91.0308333,26.680625 L96.425,26.680625 C100.491042,26.680625 101.944583,23.775625 101.944583,21.5777083 C101.944583,16.8052083 98.9972917,15.9754167 95.0983333,15.9754167 L91.0308333,15.9754167 L91.0308333,26.680625 Z M91.0308333,12.655625 L96.5916667,12.655625 C99.5779167,12.6139583 101.032083,10.7891667 101.032083,7.884375 C101.032083,5.395 99.6195833,3.36145833 96.425,3.36145833 L91.0308333,3.36145833 L91.0308333,12.655625 Z M87.2135417,30 L87.2135417,0.0420833333 L96.9652083,0.0420833333 C101.114375,0.0420833333 102.524792,1.4525 103.644792,3.11291667 C104.683542,4.73125 104.848958,6.51583333 104.848958,7.095625 C104.848958,10.83 103.562917,13.320625 99.7033333,14.1910417 L99.7033333,14.399375 C103.978333,14.8972917 105.844583,17.4695833 105.844583,21.5777083 C105.844583,29.2535417 100.242708,30 96.8402083,30 L87.2135417,30 Z' fill={color}></path>
              <path d='M113.772708,12.9047917 L119.500625,12.9047917 C122.239792,12.9047917 123.5675,10.5397917 123.5675,7.925 C123.5675,5.76791667 122.485833,3.36145833 119.540625,3.36145833 L113.772708,3.36145833 L113.772708,12.9047917 Z M113.772708,16.2245833 L113.772708,30 L109.956458,30 L109.956458,0.0420833333 L120.28875,0.0420833333 C125.6,0.0420833333 127.465625,3.77729167 127.465625,7.51104167 C127.465625,11.0377083 125.515833,13.7347917 121.988125,14.3575 L121.988125,14.44 C125.431042,14.9795833 126.675417,16.14125 126.885,22.1570833 C126.927083,23.4435417 127.341042,28.1325 127.924167,30 L123.940833,30 C122.860417,27.9254167 123.108542,24.025625 122.777083,20.041875 C122.485833,16.3908333 119.540625,16.2245833 118.25625,16.2245833 L113.772708,16.2245833 Z' fill={color}></path>
              <path d='M143.173333,3.56770833 L143.09,3.56770833 L138.401042,19.5439583 L147.989375,19.5439583 L143.173333,3.56770833 Z M140.848333,0.0420833333 L145.703958,0.0420833333 L155.45625,30 L151.181875,30 L149.025417,22.8620833 L137.448958,22.8620833 L135.207292,30 L131.349167,30 L140.848333,0.0420833333 Z' fill={color}></path>
              <path d='M162.97875,12.9047917 L168.704583,12.9047917 C171.442292,12.9047917 172.769167,10.5397917 172.769167,7.925 C172.769167,5.76791667 171.69125,3.36145833 168.745625,3.36145833 L162.97875,3.36145833 L162.97875,12.9047917 Z M162.97875,16.2245833 L162.97875,30 L159.159375,30 L159.159375,0.0420833333 L169.491667,0.0420833333 C174.801667,0.0420833333 176.670625,3.77729167 176.670625,7.51104167 C176.670625,11.0377083 174.720208,13.7347917 171.192708,14.3575 L171.192708,14.44 C174.636458,14.9795833 175.881042,16.14125 176.087917,22.1570833 C176.1325,23.4435417 176.546458,28.1325 177.125833,30 L173.142083,30 C172.064583,27.9254167 172.314583,24.025625 171.981875,20.041875 C171.69125,16.3908333 168.745625,16.2245833 167.459583,16.2245833 L162.97875,16.2245833 Z' fill={color}></path>
              <polyline fill={color} points='194.878958 0.0420833333 198.737917 0.0420833333 190.562708 18.5897917 190.562708 30 186.744583 30 186.744583 18.5897917 178.695208 0.0420833333 182.968542 0.0420833333 188.82 14.5227083 194.878958 0.0420833333'></polyline>
              <polygon fill={color} points='50.1395834 29.9875 51.19625 29.9875 51.19625 0 50.1395834 0'></polygon>
            </g>
          </g>
        </svg>
      </Link>
    </div>
  );
};

Logo.propTypes = {
  size: PropTypes.number
};

export default Logo;
