import { component$, createContextId, noSerialize, Slot, useContextProvider, useStore } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
	// Control caching for this request for best performance and to reduce hosting costs:
	// https://qwik.builder.io/docs/caching/
	cacheControl({
		// Always serve a cached response by default, up to a week stale
		staleWhileRevalidate: 60 * 60 * 24 * 7,
		// Max once every 5 seconds, revalidate on the server to get a fresh version of this page
		maxAge: 5,
	});
};

import type { Serie } from "~/components/types/music";
export const seriesCtx = createContextId<Serie[]>("series")

export default component$(() => {
	const series = useStore<Serie[]>([])
	useContextProvider(seriesCtx, series)
	return <>
		<Slot />
		<dialog 
			id="folders" 
			open 
			class="text-white w-full h-full absolute top-0 left-0 bg-blue-800 bg-opacity-75 z-50 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
			<h1 
				class="font-bold text-2xl">Vous devez sélectionner vos morceaux ⚠️</h1>
			<input 
				type="file" 
				multiple 
				id="files" 
				class="text-2xl"
				onInput$={async (event) => {
					const t = event.target as HTMLInputElement
					if(t.files === null) return
					else {
						const input = FilesToSeries(t.files)
						series.splice(0, series.length)
						series.push(...input)
						const dialog = t.parentElement as HTMLDialogElement
						dialog.close()

						const init = new CustomEvent("series-uploaded")
						document.dispatchEvent(init)
					}
				}}/>
			<span>
				<p class="italic text-sm text-center">Veillez à séléctionner organiser vos musiques les noms suivants</p>
				<p class="text-sm text-center">[Série en 2 lettres]_[titre de vos musiques].[extension]</p>
			</span>
		</dialog>
	</>;
});

function FilesToSeries(files: FileList): Serie[] {
	const series: Serie[] = []
	for(const file of files) {
		const f_name = file.name
		const f_serie = f_name.slice(0,2)
		const music_name = f_name.slice(3).split(".")[0]
		const serie = series.find(s => s.title === f_serie)
		if(serie) serie.musics.push({
			id_music: serie.musics.length,
			id_serie: series.indexOf(serie),
			title: music_name,
			serie: f_serie,
			file: noSerialize(file)
		})
		else series.push({
			title: f_serie,
			musics: [{
				id_music: 0,
				id_serie: series.length,
				title: music_name,
				serie: f_serie,
				file: noSerialize(file)
			}]
		})
	}
	return series
}
