export default {
	id: 'bic-download',
	name: 'Download',
	icon: 'box',
	description: 'Creates a file in CSV, JSON, or XML format. Returns a File id.',
	overview: ({ content, title, format }) => [
		{
			label: 'Content',
			text: content,
			note: 'Should be an array of objects, like from a Read operation, or JSON response from a Webhook.'
		},
		{
			label: 'File Title',
			text: title,
		},



		{
			label: 'Format',
			text: format,
		}
	],
	options: [
		{
			field: 'content',
			name: 'Content',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input',
			},
		},
		{
			field: 'title',
			name: 'File Title',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input',
			},
		},
		{
			field: 'filename',
			name: 'File Name',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input',
			},
		},
		{
			field: 'format',
			name: 'Format',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'select-dropdown',
				options: {
					choices: [
			
						{
							"text": "CSV",
							"value": "csv"
						},
		
						{
							"text": "JSON",
							"value": "json"
						},
						{
							"text": "XML",
							"value": "xml"
						}
					
					]
				}
				
			},
			
			
		},
		{
			field: 'folder',
			name: 'Folder ID',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input',
			},
		},

	],
};
