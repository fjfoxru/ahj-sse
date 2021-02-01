import Messager from './messager';

const messager = new Messager('http://localhost:7070/sse');
messager.bindInDom();
messager.subscribeToSSE();