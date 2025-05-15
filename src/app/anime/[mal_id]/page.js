import BackButton from "@/components/BackButton"; //CSR
import FavoriteButton from "@/components/FavoriteButton"; //CSR

//Server Side Request for anime details
async function getAnimeData(mal_id) {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${mal_id}/full`);

  if (!response.ok) throw new Error("Failed to fetch anime data");
  const data = await response.json();
  return data.data;
}

export default async function AnimeAllInfo({ params }) {
  const { mal_id } = await params;
  const anime = await getAnimeData(mal_id);

  if (!anime) return <div>No anime data found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 border-b-2 pb-2">
        <BackButton />
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/3">
          <img
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{anime.title}</h1>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">English:</span>{" "}
              {anime.title_english}
            </p>
            <p>
              <span className="font-semibold">Japanese:</span>{" "}
              {anime.title_japanese}
            </p>
            <p>
              <span className="font-semibold">Score:</span> {anime.score} (
              {anime.scored_by} votes)
            </p>
            <p>
              <span className="font-semibold">Rank:</span> #{anime.rank}
            </p>
            <p>
              <span className="font-semibold">Popularity:</span> #
              {anime.popularity}
            </p>
            <div className="flex items-center">
              <FavoriteButton />
            </div>
            <div className="flex gap-2 flex-wrap">
              {anime.genres.map((genre) => (
                <span
                  key={genre.mal_id}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <h2 className="text-xl font-bold mb-3">Information</h2>
          <p>
            <span className="font-semibold">Type:</span> {anime.type}
          </p>
          <p>
            <span className="font-semibold">Episodes:</span> {anime.episodes}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {anime.status}
          </p>
          <p>
            <span className="font-semibold">Aired:</span> {anime.aired.string}
          </p>
          <p>
            <span className="font-semibold">Duration:</span> {anime.duration}
          </p>
          <p>
            <span className="font-semibold">Rating:</span> {anime.rating}
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold mb-3">Statistics</h2>
          <p>
            <span className="font-semibold">Members:</span>{" "}
            {anime.members.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Favorites:</span>{" "}
            {anime.favorites.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Season:</span> {anime.season}{" "}
            {anime.year}
          </p>
        </div>
      </div>

      {/* Synopsis */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-3">Synopsis</h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {anime.synopsis}
        </p>
      </div>

      {/* Studios and Producers */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-3">Production</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Studios</h3>
            <ul className="list-disc list-inside">
              {anime.studios.map((studio) => (
                <li key={studio.mal_id}>{studio.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Producers</h3>
            <ul className="list-disc list-inside">
              {anime.producers.map((producer) => (
                <li key={producer.mal_id}>{producer.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trailer */}
      {anime.trailer.embed_url && (
        <div className="mb-8">
          <h2 className="text-xl font-bold my-3">Trailer</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={anime.trailer.embed_url}
              allowFullScreen
              className="w-[50%] h-[500px] mx-auto rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
