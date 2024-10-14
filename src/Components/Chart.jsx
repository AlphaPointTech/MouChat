'use client'

import { useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5map from "@amcharts/amcharts5/map";


const DATA = {
    "AF" : "Afghanistan",
    "AL" : "Albania",
    "DZ" : "Algeria",
    "AS" : "American Samoa",
    "AD" : "Andorra",
    "AO" : "Angola",
    "AI" : "Anguilla",
    "AQ" : "Antarctica",
    "AG" : "Antigua and Barbuda",
    "AR" : "Argentina",
    "AM" : "Armenia",
    "AW" : "Aruba",
    "AU" : "Australia",
    "AT" : "Austria",
    "AZ" : "Azerbaijan",
    "BS" : "Bahamas",
    "BH" : "Bahrain",
    "BD" : "Bangladesh",
    "BB" : "Barbados",
    "BY" : "Belarus",
    "BE" : "Belgium",
    "BZ" : "Belize",
    "BJ" : "Benin",
    "BM" : "Bermuda",
    "BT" : "Bhutan",
    "BO" : "Bolivia",
    "BA" : "Bosnia and Herzegovina",
    "BW" : "Botswana",
    "BR" : "Brazil",
    "IO" : "British Indian Ocean Territory",
    "VG" : "British Virgin Islands",
    "BN" : "Brunei",
    "BG" : "Bulgaria",
    "BF" : "Burkina Faso",
    "BI" : "Burundi",
    "KH" : "Cambodia",
    "CM" : "Cameroon",
    "CA" : "Canada",
    "CV" : "Cape Verde",
    "KY" : "Cayman Islands",
    "CF" : "Central African Republic",
    "TD" : "Chad",
    "CL" : "Chile",
    "CN" : "China",
    "CX" : "Christmas Island",
    "CC" : "Cocos Islands",
    "CO" : "Colombia",
    "KM" : "Comoros",
    "CK" : "Cook Islands",
    "CR" : "Costa Rica",
    "HR" : "Croatia",
    "CU" : "Cuba",
    "CW" : "Curacao",
    "CY" : "Cyprus",
    "CZ" : "Czech Republic",
    "CD" : "Democratic Republic of the Congo",
    "DK" : "Denmark",
    "DJ" : "Djibouti",
    "DM" : "Dominica",
    "DO" : "Dominican Republic",
    "TL" : "East Timor",
    "EC" : "Ecuador",
    "EG" : "Egypt",
    "SV" : "El Salvador",
    "GQ" : "Equatorial Guinea",
    "ER" : "Eritrea",
    "EE" : "Estonia",
    "ET" : "Ethiopia",
    "FK" : "Falkland Islands",
    "FO" : "Faroe Islands",
    "FJ" : "Fiji",
    "FI" : "Finland",
    "FR" : "France",
    "PF" : "French Polynesia",
    "GA" : "Gabon",
    "GM" : "Gambia",
    "GE" : "Georgia",
    "DE" : "Germany",
    "GH" : "Ghana",
    "GI" : "Gibraltar",
    "GR" : "Greece",
    "GL" : "Greenland",
    "GD" : "Grenada",
    "GU" : "Guam",
    "GT" : "Guatemala",
    "GG" : "Guernsey",
    "GN" : "Guinea",
    "GW" : "Guinea-Bissau",
    "GY" : "Guyana",
    "HT" : "Haiti",
    "HN" : "Honduras",
    "HK" : "Hong Kong",
    "HU" : "Hungary",
    "IS" : "Iceland",
    "IN" : "India",
    "ID" : "Indonesia",
    "IR" : "Iran",
    "IQ" : "Iraq",
    "IE" : "Ireland",
    "IM" : "Isle of Man",
    "IL" : "Israel",
    "IT" : "Italy",
    "CI" : "Ivory Coast",
    "JM" : "Jamaica",
    "JP" : "Japan",
    "JE" : "Jersey",
    "JO" : "Jordan",
    "KZ" : "Kazakhstan",
    "KE" : "Kenya",
    "KI" : "Kiribati",
    "XK" : "Kosovo",
    "KW" : "Kuwait",
    "KG" : "Kyrgyzstan",
    "LA" : "Laos",
    "LV" : "Latvia",
    "LB" : "Lebanon",
    "LS" : "Lesotho",
    "LR" : "Liberia",
    "LY" : "Libya",
    "LI" : "Liechtenstein",
    "LT" : "Lithuania",
    "LU" : "Luxembourg",
    "MO" : "Macau",
    "MK" : "Macedonia",
    "MG" : "Madagascar",
    "MW" : "Malawi",
    "MY" : "Malaysia",
    "MV" : "Maldives",
    "ML" : "Mali",
    "MT" : "Malta",
    "MH" : "Marshall Islands",
    "MR" : "Mauritania",
    "MU" : "Mauritius",
    "YT" : "Mayotte",
    "MX" : "Mexico",
    "FM" : "Micronesia",
    "MD" : "Moldova",
    "MC" : "Monaco",
    "MN" : "Mongolia",
    "ME" : "Montenegro",
    "MS" : "Montserrat",
    "MA" : "Morocco",
    "MZ" : "Mozambique",
    "MM" : "Myanmar",
    "NA" : "Namibia",
    "NR" : "Nauru",
    "NP" : "Nepal",
    "NL" : "Netherlands",
    "AN" : "Netherlands Antilles",
    "NC" : "New Caledonia",
    "NZ" : "New Zealand",
    "NI" : "Nicaragua",
    "NE" : "Niger",
    "NG" : "Nigeria",
    "NU" : "Niue",
    "KP" : "North Korea",
    "MP" : "Northern Mariana Islands",
    "NO" : "Norway",
    "OM" : "Oman",
    "PK" : "Pakistan",
    "PW" : "Palau",
    "PS" : "Palestine",
    "PA" : "Panama",
    "PG" : "Papua New Guinea",
    "PY" : "Paraguay",
    "PE" : "Peru",
    "PH" : "Philippines",
    "PN" : "Pitcairn",
    "PL" : "Poland",
    "PT" : "Portugal",
    "PR" : "Puerto Rico",
    "QA" : "Qatar",
    "CG" : "Republic of the Congo",
    "RE" : "Reunion",
    "RO" : "Romania",
    "RU" : "Russia",
    "RW" : "Rwanda",
    "BL" : "Saint Barthelemy",
    "SH" : "Saint Helena",
    "KN" : "Saint Kitts and Nevis",
    "LC" : "Saint Lucia",
    "MF" : "Saint Martin",
    "PM" : "Saint Pierre and Miquelon",
    "VC" : "Saint Vincent and the Grenadines",
    "WS" : "Samoa",
    "SM" : "San Marino",
    "ST" : "Sao Tome and Principe",
    "SA" : "Saudi Arabia",
    "SN" : "Senegal",
    "RS" : "Serbia",
    "SC" : "Seychelles",
    "SL" : "Sierra Leone",
    "SG" : "Singapore",
    "SX" : "Sint Maarten",
    "SK" : "Slovakia",
    "SI" : "Slovenia",
    "SB" : "Solomon Islands",
    "SO" : "Somalia",
    "ZA" : "South Africa",
    "KR" : "South Korea",
    "SS" : "South Sudan",
    "ES" : "Spain",
    "LK" : "Sri Lanka",
    "SD" : "Sudan",
    "SR" : "Suriname",
    "SJ" : "Svalbard and Jan Mayen",
    "SZ" : "Swaziland",
    "SE" : "Sweden",
    "CH" : "Switzerland",
    "SY" : "Syria",
    "TW" : "Taiwan",
    "TJ" : "Tajikistan",
    "TZ" : "Tanzania",
    "TH" : "Thailand",
    "TG" : "Togo",
    "TK" : "Tokelau",
    "TO" : "Tonga",
    "TT" : "Trinidad and Tobago",
    "TN" : "Tunisia",
    "TR" : "Turkey",
    "TM" : "Turkmenistan",
    "TC" : "Turks and Caicos Islands",
    "TV" : "Tuvalu",
    "VI" : "U.S. Virgin Islands",
    "UG" : "Uganda",
    "UA" : "Ukraine",
    "AE" : "United Arab Emirates",
    "GB" : "United Kingdom",
    "US" : "United States",
    "UY" : "Uruguay",
    "UZ" : "Uzbekistan",
    "VU" : "Vanuatu",
    "VA" : "Vatican",
    "VE" : "Venezuela",
    "VN" : "Vietnam",
    "WF" : "Wallis and Futuna",
    "EH" : "Western Sahara",
    "YE" : "Yemen",
    "ZM" : "Zambia",
    "ZW" : "Zimbabwe"
  }

function Chart({onSelectCountry}) {
  useLayoutEffect(() => {
    var root = am5.Root.new("chartdiv");
    am5.ready(function() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        
        
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
          am5themes_Animated.new(root)
        ]);
        
        
        // Create the map chart
        // https://www.amcharts.com/docs/v5/charts/map-chart/
        var chart = root.container.children.push(am5map.MapChart.new(root, {
          panX: "translateX",
          panY: "translateY",
          projection: am5map.geoMercator()
        }));


          
        
        
        // Create main polygon series for countries
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
        var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ["AQ"]
        }));
        // chart.events.on("click", function(ev) {
        //     console.log("NYC, ", chart.convert(chart.invert(ev.point)));
        //     polygonSeries.mapPolygons.each(p => {
        //         if (p.isActive){
        //             console.log(p.states._entity)
        //         }
        //       })
            
        //   });
        
        polygonSeries.mapPolygons.template.setAll({
          tooltipText: "{name}",
          toggleKey: "active",
          interactive: true
        });
        
        polygonSeries.mapPolygons.template.states.create("hover", {
          fill: root.interfaceColors.get("primaryButtonHover")
        });
        
        polygonSeries.mapPolygons.template.states.create("active", {
          fill: root.interfaceColors.get("primaryButtonHover")
        });
        
        var previousPolygon;
        
        polygonSeries.mapPolygons.template.on("active", function (active, target) {
            
          if (previousPolygon && previousPolygon != target) {
            previousPolygon.set("active", false);
          }
          if (target.get("active")) {
            const country_name = DATA[target.states._entity._dataItem.dataContext.id]
            onSelectCountry(country_name)
            polygonSeries.zoomToDataItem(target.dataItem );
          }
          else {
            chart.goHome();
          }
          previousPolygon = target;
        });
        
        
        // Add zoom control
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zoom_control
        var zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
        zoomControl.homeButton.set("visible", true);
        
        // Set clicking on "water" to zoom out
        chart.chartContainer.get("background").events.on("click", function () {
          chart.goHome();
        })
        // chart.events.on("focus", function (e) {
        //   console.log(e)
        // });
        
        // Make stuff animate on load
        chart.appear(1000, 100);
    });
    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div>
        <div id="chartdiv" style={{ width: "100%", height: "800px" }}></div>
    </div>
  );
}
export default Chart;