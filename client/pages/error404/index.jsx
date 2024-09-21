export default function Error404({ setTitle, mainAppend }) {
    setTitle('Ошибка 404');
    mainAppend(<>Похоже, этой страницы не существует.</>);
}