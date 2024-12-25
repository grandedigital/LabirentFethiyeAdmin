export default function useUser() {
    const config = JSON.parse(localStorage.getItem('config'))
    // const token = localStorage.getItem('serviceToken')

    return { config }
}

