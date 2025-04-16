"""
Centralized database connection management using Supabase.
"""

import os
from typing import Optional
from supabase import create_async_client, AsyncClient

class DBConnection:
    """Singleton database connection manager using Supabase."""
    
    _instance: Optional['DBConnection'] = None
    _initialized = False
    _client: Optional[AsyncClient] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """No initialization needed in __init__ as it's handled in __new__"""
        pass

    async def initialize(self):
        """Initialize the database connection."""
        if self._initialized:
            return
                
        try:
            supabase_url = os.getenv('SUPABASE_URL')
            # Use service role key preferentially for backend operations
            supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY', os.getenv('SUPABASE_ANON_KEY'))
            
            if not supabase_url or not supabase_key:
                print("Missing required environment variables for Supabase connection")
                raise RuntimeError("SUPABASE_URL and a key (SERVICE_ROLE_KEY or ANON_KEY) environment variables must be set.")

            print("Initializing Supabase connection")
            self._client = await create_async_client(supabase_url, supabase_key)
            self._initialized = True
            key_type = "SERVICE_ROLE_KEY" if os.getenv('SUPABASE_SERVICE_ROLE_KEY') else "ANON_KEY"
            print(f"Database connection initialized with Supabase using {key_type}")
        except Exception as e:
            print(f"Database initialization error: {e}")
            raise RuntimeError(f"Failed to initialize database connection: {str(e)}")

    @classmethod
    async def disconnect(cls):
        """Disconnect from the database."""
        if cls._instance and cls._instance._client:
            print("Disconnecting from Supabase database")
            await cls._instance._client.close()
            cls._instance._initialized = False
            cls._instance._client = None
            print("Database disconnected successfully")

    @property
    async def client(self) -> AsyncClient:
        """Get the Supabase client instance."""
        if not self._initialized:
            print("Supabase client not initialized, initializing now")
            await self.initialize()
        if not self._client:
            print("Database client is None after initialization")
            raise RuntimeError("Database not initialized")
        return self._client 