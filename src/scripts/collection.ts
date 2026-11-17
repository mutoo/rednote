const storageKey = 'mutoo-toolbox:saved';
const cards = [...document.querySelectorAll<HTMLElement>('[data-tool-id]')];
const validIds = new Set(cards.map((card) => card.dataset.toolId!));
const searchInput = document.querySelector<HTMLInputElement>('#tool-search')!;
const clearButton = document.querySelector<HTMLButtonElement>('.clear-search')!;
const filterButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
const emptyState = document.querySelector<HTMLElement>('[data-empty-state]')!;
const emptyTitle = document.querySelector<HTMLElement>('[data-empty-title]')!;
const emptyDescription = document.querySelector<HTMLElement>('[data-empty-description]')!;
const comingSoon = document.querySelector<HTMLElement>('[data-coming-soon]')!;
const resultsStatus = document.querySelector<HTMLElement>('[data-results-status]')!;
const toast = document.querySelector<HTMLElement>('[data-toast]')!;
let activeFilter = 'all';
let saved = new Set<string>();
let toastTimeout: ReturnType<typeof setTimeout>;

function readSaved() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    saved = new Set(Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && validIds.has(id)) : []);
  } catch {
    saved = new Set();
  }
}

function notify(message: string) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function render() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  let visibleCount = 0;

  for (const card of cards) {
    const id = card.dataset.toolId!;
    const matchesSearch = terms.every((term) => card.dataset.search!.includes(term));
    const matchesFilter = activeFilter === 'all'
      || (activeFilter === 'made' && card.dataset.madeByMe === 'true')
      || (activeFilter === 'saved' && saved.has(id));
    card.hidden = !(matchesSearch && matchesFilter);
    if (!card.hidden) visibleCount++;

    const button = card.querySelector<HTMLButtonElement>('[data-save]')!;
    const isSaved = saved.has(id);
    button.setAttribute('aria-pressed', String(isSaved));
    button.setAttribute('aria-label', `${isSaved ? '取消收藏' : '收藏'}${button.dataset.title}`);
    button.title = isSaved ? '取消收藏' : '收藏这个工具';
    button.querySelector('[data-save-label]')!.textContent = isSaved ? '已收藏' : '收藏';
  }

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  document.querySelector('[data-saved-count]')!.textContent = String(saved.size);
  clearButton.hidden = !searchInput.value;
  searchInput.closest('.search-box')!.classList.toggle('has-value', Boolean(searchInput.value));
  comingSoon.hidden = activeFilter !== 'all' || Boolean(query);
  emptyState.hidden = visibleCount > 0;
  const emptySaved = activeFilter === 'saved' && saved.size === 0;
  emptyTitle.textContent = emptySaved ? '你的好用清单，等你来填' : '还没找到这个工具';
  emptyDescription.textContent = emptySaved
    ? '点一下工具卡片上的「收藏」，下次就能在这里找到。收藏会保存在当前浏览器。'
    : '换个关键词试试，比如「澳洲」或「8558」。';
  resultsStatus.textContent = query
    ? `「${searchInput.value.trim()}」找到 ${visibleCount} 个工具`
    : `显示 ${visibleCount} 个工具`;
}

readSaved();
document.querySelectorAll<HTMLElement>('[data-search-box], [data-toolbar], [data-save]').forEach((element) => { element.hidden = false; });
render();

searchInput.addEventListener('input', render);
clearButton.addEventListener('click', () => {
  searchInput.value = '';
  render();
  searchInput.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter!;
    render();
  });
});

document.querySelector('[data-reset]')!.addEventListener('click', () => {
  activeFilter = 'all';
  searchInput.value = '';
  render();
  filterButtons[0].focus();
});

document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.save!;
    const wasSaved = saved.has(id);
    if (wasSaved) saved.delete(id);
    else saved.add(id);

    let persisted = true;
    try {
      localStorage.setItem(storageKey, JSON.stringify([...saved]));
    } catch {
      persisted = false;
    }
    render();
    if (button.closest<HTMLElement>('[data-tool-id]')!.hidden) {
      filterButtons.find((filter) => filter.dataset.filter === activeFilter)?.focus();
    }
    notify(persisted
      ? (wasSaved ? '已取消收藏，喜欢时再收回来。' : '已放进你的收藏，保存在当前浏览器。')
      : '当前浏览器无法保存，收藏仅在本次浏览中有效。');
  });
});

window.addEventListener('storage', (event) => {
  if (event.key === storageKey || event.key === null) {
    readSaved();
    render();
  }
});

document.addEventListener('keydown', (event) => {
  const target = event.target;
  const isEditing = target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable);
  if (event.key === '/' && !isEditing && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === 'Escape' && document.activeElement === searchInput) {
    searchInput.value = '';
    render();
    searchInput.blur();
  }
});
