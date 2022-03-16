import axios, { Method } from 'axios'

type PossibleExtension = 'glb'

const getConvertedFileUrl = async (file: File, to: PossibleExtension) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', to)
    formData.append('id', String(Date.now() / 1000))
    
    const options: {
      headers: any;
      baseURL: string | undefined;
      url: string;
      method: Method;
      data?: any;
      params?: any;
    } = {
      headers: { 'Content-Type': 'multipart/form-data' },
      baseURL: 'https://dev-api-converter.plask.ai/api', 
      url: '/converter/model',
      method: 'POST',
      data: formData,
    }

    options.headers['Accept'] = 'application/json';
    options.headers['Content-Type'] = 'application/json; charset=utf-8';

    const response = await axios(options)
    return response.data.data.url
  } catch (error) {
    throw error
  }
}

export default getConvertedFileUrl