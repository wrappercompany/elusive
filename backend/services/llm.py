from typing import Union, Dict, Any, Optional, List
import os
import asyncio
import litellm

async def make_llm_api_call(
    messages: List[Dict[str, Any]],
    model_name: str,
    temperature: float = 0,
    max_tokens: Optional[int] = None,
    stream: bool = False
) -> Dict[str, Any]:
    """
    Make an API call to a language model using LiteLLM.
    """
    params = {
        "model": model_name,
        "messages": messages,
        "temperature": temperature,
        "stream": stream,
    }
    
    if max_tokens is not None:
        params["max_tokens"] = max_tokens
    
    try:
        response = await litellm.acompletion(**params)
        return response
    except Exception as e:
        print(f"Error during API call: {str(e)}")
        raise RuntimeError(f"API call failed: {str(e)}") 