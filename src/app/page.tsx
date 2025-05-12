"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type WeatherDataType = {
  city: string;
  curr_temp: string;
  weather_cond: string;
  humidity: string;
  wind_speed: string;
};

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
      );

      const data = await response.json();

      if (data.cod !== 200) {
        setError("City not found. Please check the name and try again.");
        setLoading(false);
        return;
      }

      const simplifiedData: WeatherDataType = {
        city: data.name,
        curr_temp: `${data.main.temp} °C`,
        weather_cond: data.weather[0].main,
        humidity: `${data.main.humidity} %`,
        wind_speed: `${data.wind.speed} m/s`,
      };

      setWeatherData(simplifiedData);
    } catch (error) {
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gradient-to-b from-blue-100 to-white">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-3xl font-semibold text-blue-800">
          Check Current Weather
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Input
            type="text"
            placeholder="Enter city name"
            className="w-80 text-base"
            onChange={(e) => setCity(e.target.value)}
          />
          <Button
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={handleFetchWeather}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Weather Info"}
          </Button>
        </div>

        {error && (
          <div className="text-red-600 font-medium">{error}</div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-6 w-full sm:w-96 mt-4 border border-blue-200">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {weatherData && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-md p-6 w-full sm:w-96 mt-4 border border-blue-200">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">
              Weather in {weatherData.city}
            </h2>
            <p><strong>Temperature:</strong> {weatherData.curr_temp}</p>
            <p><strong>Condition:</strong> {weatherData.weather_cond}</p>
            <p><strong>Humidity:</strong> {weatherData.humidity}</p>
            <p><strong>Wind Speed:</strong> {weatherData.wind_speed}</p>
          </div>
        )}
      </main>
    </div>
  );
}
