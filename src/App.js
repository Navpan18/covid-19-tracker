import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import { useEffect, useState } from "react";
import "./App.css";
import Infobox from "./Infobox";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import Map from "./Map";
import Table from "./Table";
import { prettyPrintStat, sortData } from "./util";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [checked, setChecked] = useState(false);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 23.0707, lng: 80.0982 });
  const [mapCountries, setMapCountries] = useState([]);
  const [mapZoom, setMapZoom] = useState(3);
  useEffect(() => {
    fetch(`https://disease.sh/v3/covid-19/all`)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  const toggleChecked = () => {
    setChecked((prev) => !prev);
  };

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (Event) => {
    const countryCode = Event.target.value;
    const url =
      countryCode === "worldwide"
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        setCountry(countryCode);
      });
  };
  console.log("countryinfo>>>>>>>>", countryInfo);
  return (
    <div className={`app `}>
      <div className="app_left">
        <div className="app_header">
          <h1>Covid 19 Tracker</h1>
          <div className="app_headerControls">
            <FormControl className={`app_dropdown`}>
              <Select
                className={`${checked ? "app_darkSelect" : "app_select"}`}
                variant="outlined"
                value={country}
                onChange={onCountryChange}
              >
                <MenuItem value="Worldwide">Worldwide</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
          
        <div className="app_stats">
          <Infobox
            checked={checked}
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <Infobox
            checked={checked}
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <Infobox
            checked={checked}
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h2 className="app_graphTitle2">Live cases by country</h2>
          <Table countries={tableData} />
          <h2 className="app_graphTitle">Worldwide New {casesType}</h2>
          <div className="whitebg app_graph">
          <LineGraph  casesType={casesType} checked={checked} /></div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
