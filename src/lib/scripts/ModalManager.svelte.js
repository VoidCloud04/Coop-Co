const defaultModal = {
    type: 'alert',
    title: '',
    content: '',
    color: 'white',
    placeholder: '',
    value: '',
    confirmText: 'OK',
    cancelText: 'Cancel'
}

export let modalState = $state({
    ...defaultModal,
    open: false
})

let resolveModal = null

function openModal(config) {
    return new Promise((resolve) => {
        // Only one modal exists at a time. Opening another cancels the previous one.
        if (resolveModal) {
            resolveModal(modalState.type === 'prompt' ? null : false)
        }

        resolveModal = resolve
        Object.assign(modalState, defaultModal, config, { open: true })
    })
}

export function alertModal(options = {}) {
    return openModal({ ...options, type: 'alert' })
}

export function promptModal(options = {}) {
    return openModal({
        confirmText: 'Submit',
        cancelText: 'Cancel',
        ...options,
        type: 'prompt'
    })
}

export function confirmModal(options = {}) {
    return openModal({
        confirmText: 'Yes!',
        cancelText: 'No!',
        ...options,
        type: 'confirm'
    })
}

export function closeModal(result) {
    if (!modalState.open) return

    modalState.open = false

    const resolve = resolveModal
    resolveModal = null
    resolve?.(result)
}
