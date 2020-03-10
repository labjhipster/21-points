import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPreferences } from 'app/shared/model/preferences.model';
import { PreferencesService } from './preferences.service';
import { PreferencesDeleteDialogComponent } from './preferences-delete-dialog.component';

@Component({
  selector: 'jhi-preferences',
  templateUrl: './preferences.component.html'
})
export class PreferencesComponent implements OnInit, OnDestroy {
  preferences?: IPreferences[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected preferencesService: PreferencesService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.preferencesService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<IPreferences[]>) => (this.preferences = res.body || []));
      return;
    }

    this.preferencesService.query().subscribe((res: HttpResponse<IPreferences[]>) => (this.preferences = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPreferences();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IPreferences): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInPreferences(): void {
    this.eventSubscriber = this.eventManager.subscribe('preferencesListModification', () => this.loadAll());
  }

  delete(preferences: IPreferences): void {
    const modalRef = this.modalService.open(PreferencesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.preferences = preferences;
  }
}
