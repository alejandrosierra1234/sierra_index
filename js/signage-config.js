(function (root) {
  'use strict'
  // Public deployment coordinates only. Never place service_role, pairing
  // peppers, TURN credentials or verifier tokens in this file.
  root.SIERRA_SIGNAGE_CONFIG = root.SIERRA_SIGNAGE_CONFIG || Object.freeze({
    enabled: false,
    backendUrl: '',
    allowedOrigins: [],
    workspaceId: '',
    siteId: '',
  })
})(typeof globalThis !== 'undefined' ? globalThis : this)
