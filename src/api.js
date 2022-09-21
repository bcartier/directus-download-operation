//import FormData from 'form-data';
import { file as createTempFile } from 'tmp-promise';
import { appendFile, createReadStream } from 'fs-extra';


export default {
	id: 'bic-download',
	handler: async ({ content, title, filename, format, folder }, { services, accountability, database, getSchema }) => {
		try {
			const schema = await getSchema();


			const exportService = new services.ExportService({ accountability, schema });


			const filesService = new services.FilesService({database, accountability, schema});

			const { path, cleanup } = await createTempFile();

			const storage = 'local';

			const mimeTypes = {
				xml: 'text/xml',
				csv: 'text/csv',
				json: 'application/json',
			};
		

			const fullFilename = `${filename}-${getDateFormatted()}.${format}`;

			const fileWithDefaults  = {
				title: title,
				filename_download: fullFilename,
				type: mimeTypes[format],
				storage: storage,
				folder: folder
			};

			const contentItemsTotal = content.length;
			const batchSize = 10;
			const batches = sliceIntoChunks(content, batchSize);
			const batchesRequired = Math.ceil(contentItemsTotal / batchSize);

			console.log("==== Batch Info ====");
			console.log(`Total Items: ${contentItemsTotal}`);
			console.log(`Number of Batches: ${batchesRequired}`);
			console.log("====/Batch Info ====");

	

			for (let batch = 0; batch < batchesRequired; batch++) {
				const batchData = await exportService.transform(batches[batch], format, {
					includeHeader: batch === 0,
					includeFooter: batch + 1 === batchesRequired,
				});

				await appendFile(path,batchData);
	
			}


			const savedFile = await filesService.uploadOne(createReadStream(path), fileWithDefaults);

			if (accountability.user) {
				const notificationsService = new services.NotificationsService({ accountability, schema});

				await notificationsService.createOne({
					recipient: accountability.user,
					sender: accountability.user,
					subject: `Your file is ready to download`,
					collection: `directus_files`,
					item: savedFile,
				});
			}


			await cleanup();

		} catch (error) {

			console.log(error);
			
		}
	}
};

  
function getDateFormatted() {
	const date = new Date();
  
	let month = String(date.getMonth() + 1);
	if (month.length === 1) month = '0' + month;
  
	let day = String(date.getDate());
	if (day.length === 1) day = '0' + day;
  
	return `${date.getFullYear()}-${month}-${day}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  }


  function sliceIntoChunks(arr, chunkSize) {
	const res = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize);
		res.push(chunk);
	}
	return res;
}
