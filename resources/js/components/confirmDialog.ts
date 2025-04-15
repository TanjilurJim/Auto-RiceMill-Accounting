import Swal from 'sweetalert2';

interface ConfirmDialogOptions {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
}

export const confirmDialog = async (
    options: ConfirmDialogOptions = {},
    onConfirm: () => void
) => {
    const {
        title = 'Are you sure?',
        text = "You won't be able to revert this!",
        confirmButtonText = 'Yes, delete it!',
        confirmButtonColor = '#F96D6D',
        cancelButtonColor = '#A9D7F6',
    } = options;

    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor,
        cancelButtonColor,
        confirmButtonText,
    });

    if (result.isConfirmed) {
        onConfirm();
        // Swal.fire('Deleted!', 'The item has been deleted.', 'success');
        Swal.fire({
            title: 'Deleted!',
            text: 'The item has been deleted.',
            icon: 'success',
            customClass: {
                confirmButton: 'bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover',
            },
            buttonsStyling: false,
        });
    }
};