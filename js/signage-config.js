(function (root) {
  'use strict'
  // Public deployment coordinates only. Never place service_role, pairing
  // peppers, TURN credentials or verifier tokens in this file.
  root.SIERRA_SIGNAGE_CONFIG = root.SIERRA_SIGNAGE_CONFIG || Object.freeze({
    // Pilot enabled after verifying Edge health, the exact Pages CORS origin,
    // the pairing secret and one controlled pairing request. Private media is
    // verified inside signage-api; live sharing remains separately disabled.
    enabled: true,
    backendUrl: 'https://vhyddogeemohtqijohry.supabase.co/functions/v1/signage-api',
    allowedOrigins: ['https://vhyddogeemohtqijohry.supabase.co'],
    workspaceId: '6157f870-089b-40c9-8169-93feae5e3bf9',
    siteId: 'dfe2bb9b-1bae-42c2-984d-7741612e4888',
    mediaEnabled: true,
    liveEnabled: false,
  })
})(typeof globalThis !== 'undefined' ? globalThis : this)
