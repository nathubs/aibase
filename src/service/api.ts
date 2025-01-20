export const API = {
  // Notify:'/v1/gameCase/notify',

  DetectFaces: "/v1/faceRecognition/detectFaces",
  LprRec: "/v1/lpr/rec",
  ObjectDetection: "/v1/objectDetection/process",

  /** 智能模型 */
  Chatgpt: "/chat/chat",
  ChatKnowledge: "/chat/knowledge_base_chat",
  ChatEngine: "/chat/search_engine_chat",
  ChatAgent: "/chat/agent_chat",

  GetModelsConfig: "/llm_model/list_running_models",
  GetKonwledgeList: "/knowledge_base/list_knowledge_bases",
  GetEngineList: "/server/list_search_engines",

  LandscapePainting: "/v1/landscapePainting/process",
  getTTsProcess: "/v1/tts/process",
  getOcrProcess: "/v1/ocr/process",
};
